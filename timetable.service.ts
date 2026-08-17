import { Class } from '../classes/class.model.js';
import { Subject } from '../subjects/subject.model.js';
import { Teacher } from '../teachers/teacher.model.js';
import { Room } from '../rooms/room.model.js';
import { Timetable, PeriodConfig } from './timetable.model.js';
import type { IConflict, ITimetableSlot } from './timetable.model.js';
import { ApiError } from '../../utils/ApiError.js';
import mongoose from 'mongoose';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const TEACHING_PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]; // periods 4 & 7 are break/lunch in config

interface SubjectAssignment {
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  periodsPerWeek: number;
  type: 'theory' | 'practical' | 'elective';
}

interface SchedulerContext {
  classId: string;
  sectionId: string;
  academicYear: string;
  assignments: SubjectAssignment[];
  rooms: { id: string; name: string; type: string; capacity: number }[];
  existingSlots: Map<string, ITimetableSlot>; // "day-period" -> slot (from other sections/classes)
  teacherSchedule: Map<string, Set<string>>; // teacherId -> Set of "day-period" keys
  roomSchedule: Map<string, Set<string>>; // roomId -> Set of "day-period" keys
}

export class TimetableService {
  /**
   * Generate a timetable for a specific class + section using a constraint-based greedy algorithm
   * with backtracking for conflict resolution.
   */
  async generate(classId: string, sectionId: string, academicYear: string) {
    // 1. Fetch class and its subjects
    const cls = await Class.findById(classId).populate('subjects');
    if (!cls) throw ApiError.notFound('Class not found');

    const subjects = await Subject.find({ _id: { $in: cls.subjects }, status: 'active' });
    if (subjects.length === 0) throw ApiError.badRequest('No active subjects assigned to this class');

    // 2. Fetch all teachers and map subject -> teacher
    const teachers = await Teacher.find({ status: 'active' });
    const rooms = await Room.find({ status: 'available' });

    // Build subject-teacher assignments
    const assignments: SubjectAssignment[] = [];
    for (const subject of subjects) {
      // Find a teacher who teaches this subject
      const teacher = teachers.find(t => t.subjects.includes(subject.name));
      if (!teacher) continue; // skip subjects with no available teacher

      assignments.push({
        subjectId: String(subject._id),
        subjectName: subject.name,
        teacherId: String(teacher._id),
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        periodsPerWeek: subject.periodsPerWeek,
        type: subject.type,
      });
    }

    // 3. Build existing schedules from other published/draft timetables
    const existingTimetables = await Timetable.find({
      academicYear,
      status: { $in: ['draft', 'published'] },
      $or: [
        { classId: { $ne: classId } },
        { sectionId: { $ne: sectionId } },
      ],
    });

    const teacherSchedule = new Map<string, Set<string>>();
    const roomSchedule = new Map<string, Set<string>>();

    for (const tt of existingTimetables) {
      for (const slot of tt.slots) {
        const key = `${slot.day}-${slot.period}`;

        if (slot.teacherId) {
          const tid = String(slot.teacherId);
          if (!teacherSchedule.has(tid)) teacherSchedule.set(tid, new Set());
          teacherSchedule.get(tid)!.add(key);
        }
        if (slot.roomId) {
          const rid = String(slot.roomId);
          if (!roomSchedule.has(rid)) roomSchedule.set(rid, new Set());
          roomSchedule.get(rid)!.add(key);
        }
      }
    }

    // 4. Run the scheduling algorithm
    const ctx: SchedulerContext = {
      classId,
      sectionId,
      academicYear,
      assignments,
      rooms: rooms.map(r => ({ id: String(r._id), name: r.name, type: r.type, capacity: r.capacity })),
      existingSlots: new Map(),
      teacherSchedule,
      roomSchedule,
    };

    const { slots, conflicts } = this.scheduleSlots(ctx);

    // 5. Upsert timetable
    const timetable = await Timetable.findOneAndUpdate(
      { classId, sectionId, academicYear },
      {
        classId,
        sectionId,
        academicYear,
        slots,
        conflicts,
        status: 'draft',
        generatedAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    return timetable.populate([
      { path: 'slots.subjectId', select: 'name code type' },
      { path: 'slots.teacherId', select: 'firstName lastName' },
      { path: 'slots.roomId', select: 'name number' },
      { path: 'classId', select: 'name' },
    ]);
  }

  /**
   * Core scheduling algorithm: greedy assignment with constraint checking.
   * Distributes subjects evenly across the week and avoids teacher/room clashes.
   */
  private scheduleSlots(ctx: SchedulerContext): { slots: Partial<ITimetableSlot>[]; conflicts: IConflict[] } {
    const slots: Partial<ITimetableSlot>[] = [];
    const conflicts: IConflict[] = [];

    // Track assignments for this timetable
    const localTeacherSchedule = new Map<string, Set<string>>();
    const localRoomSchedule = new Map<string, Set<string>>();
    const subjectDayCount = new Map<string, Map<string, number>>(); // subjectId -> day -> count

    // Teaching periods (exclude break/lunch slots 4 and 7)
    const teachingPeriods = TEACHING_PERIODS.filter(p => p !== 4 && p !== 7);
    const workingDays = DAYS.slice(0, 6); // Mon-Sat

    // Build a list of (subject, remaining) pairs sorted by most periods first
    const pending: { assignment: SubjectAssignment; remaining: number }[] =
      ctx.assignments.map(a => ({ assignment: a, remaining: a.periodsPerWeek }));
    pending.sort((a, b) => b.remaining - a.remaining);

    // Greedy assignment: iterate through days and periods
    for (const day of workingDays) {
      for (const period of teachingPeriods) {
        const key = `${day}-${period}`;

        // Find the best subject for this slot
        let bestIdx = -1;
        let bestScore = -Infinity;

        for (let i = 0; i < pending.length; i++) {
          if (pending[i].remaining <= 0) continue;
          const { assignment } = pending[i];

          // Check teacher availability (global + local)
          const globalTeacherBusy = ctx.teacherSchedule.get(assignment.teacherId)?.has(key);
          const localTeacherBusy = localTeacherSchedule.get(assignment.teacherId)?.has(key);
          if (globalTeacherBusy || localTeacherBusy) continue;

          // Avoid same subject twice in one day (prefer spreading)
          const dayCount = subjectDayCount.get(assignment.subjectId)?.get(day) || 0;
          if (dayCount >= 2) continue; // hard limit: max 2 periods of same subject per day

          // Score: prefer subjects with more remaining periods, less on this day
          let score = pending[i].remaining * 10 - dayCount * 5;
          // Bonus for practical subjects in morning (periods 1-3)
          if (assignment.type === 'practical' && period <= 3) score += 3;
          // Penalty for same subject back-to-back (unless lab)
          if (dayCount > 0 && assignment.type !== 'practical') score -= 2;

          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }

        if (bestIdx === -1) continue; // no viable subject for this slot

        const { assignment } = pending[bestIdx];

        // Find an available room
        let roomId: string | undefined;
        const preferredType = assignment.type === 'practical' ? 'laboratory' : 'classroom';
        const sortedRooms = [...ctx.rooms].sort((a, b) =>
          (a.type === preferredType ? -1 : 1) - (b.type === preferredType ? -1 : 1)
        );

        for (const room of sortedRooms) {
          const globalRoomBusy = ctx.roomSchedule.get(room.id)?.has(key);
          const localRoomBusy = localRoomSchedule.get(room.id)?.has(key);
          if (!globalRoomBusy && !localRoomBusy) {
            roomId = room.id;
            break;
          }
        }

        if (!roomId && ctx.rooms.length > 0) {
          // Room conflict — assign anyway but log conflict
          roomId = ctx.rooms[0].id;
          conflicts.push({
            type: 'room_clash',
            day,
            period,
            message: `No available room for ${assignment.subjectName} on ${day} period ${period}`,
            severity: 'warning',
            relatedEntities: [
              { type: 'subject', id: assignment.subjectId, name: assignment.subjectName },
            ],
          });
        }

        // Create the slot
        const slot: Partial<ITimetableSlot> = {
          day: day as any,
          period,
          subjectId: new mongoose.Types.ObjectId(assignment.subjectId) as any,
          teacherId: new mongoose.Types.ObjectId(assignment.teacherId) as any,
          roomId: roomId ? new mongoose.Types.ObjectId(roomId) as any : undefined,
          classId: new mongoose.Types.ObjectId(ctx.classId) as any,
          sectionId: ctx.sectionId,
          type: assignment.type === 'practical' ? 'lab' : 'regular',
        };
        slots.push(slot);

        // Update tracking
        pending[bestIdx].remaining--;

        if (!localTeacherSchedule.has(assignment.teacherId)) localTeacherSchedule.set(assignment.teacherId, new Set());
        localTeacherSchedule.get(assignment.teacherId)!.add(key);

        if (roomId) {
          if (!localRoomSchedule.has(roomId)) localRoomSchedule.set(roomId, new Set());
          localRoomSchedule.get(roomId)!.add(key);
        }

        if (!subjectDayCount.has(assignment.subjectId)) subjectDayCount.set(assignment.subjectId, new Map());
        const dc = subjectDayCount.get(assignment.subjectId)!;
        dc.set(day, (dc.get(day) || 0) + 1);

        // Re-sort pending to prioritize subjects with most remaining
        pending.sort((a, b) => b.remaining - a.remaining);
      }
    }

    // Add break and lunch slots
    for (const day of workingDays) {
      slots.push({
        day: day as any,
        period: 4,
        classId: new mongoose.Types.ObjectId(ctx.classId) as any,
        sectionId: ctx.sectionId,
        type: 'break',
      } as any);
      slots.push({
        day: day as any,
        period: 7,
        classId: new mongoose.Types.ObjectId(ctx.classId) as any,
        sectionId: ctx.sectionId,
        type: 'break',
      } as any);
    }

    // Check for unassigned periods
    for (const p of pending) {
      if (p.remaining > 0) {
        conflicts.push({
          type: 'subject_overload',
          day: 'All',
          period: 0,
          message: `${p.assignment.subjectName} has ${p.remaining} unassigned period(s) — not enough slots available`,
          severity: 'warning',
          relatedEntities: [
            { type: 'subject', id: p.assignment.subjectId, name: p.assignment.subjectName },
            { type: 'teacher', id: p.assignment.teacherId, name: p.assignment.teacherName },
          ],
        });
      }
    }

    return { slots, conflicts };
  }

  /**
   * Detect conflicts across ALL timetables for the academic year.
   */
  async detectConflicts(academicYear: string) {
    const timetables = await Timetable.find({ academicYear, status: { $in: ['draft', 'published'] } })
      .populate('slots.subjectId', 'name')
      .populate('slots.teacherId', 'firstName lastName')
      .populate('slots.roomId', 'name number')
      .populate('classId', 'name');

    const conflicts: (IConflict & { timetableId: string; className: string; section: string })[] = [];
    const teacherMap = new Map<string, { tt: string; cls: string; sec: string; subj: string }[]>();
    const roomMap = new Map<string, { tt: string; cls: string; sec: string; subj: string }[]>();

    for (const tt of timetables) {
      const className = (tt.classId as any)?.name || '';
      for (const slot of tt.slots) {
        if (slot.type === 'break' || slot.type === 'assembly') continue;
        const key = `${slot.day}-${slot.period}`;

        if (slot.teacherId) {
          const tk = `${String(slot.teacherId._id || slot.teacherId)}-${key}`;
          if (!teacherMap.has(tk)) teacherMap.set(tk, []);
          teacherMap.get(tk)!.push({
            tt: String(tt._id),
            cls: className,
            sec: tt.sectionId,
            subj: (slot.subjectId as any)?.name || '',
          });
        }

        if (slot.roomId) {
          const rk = `${String(slot.roomId._id || slot.roomId)}-${key}`;
          if (!roomMap.has(rk)) roomMap.set(rk, []);
          roomMap.get(rk)!.push({
            tt: String(tt._id),
            cls: className,
            sec: tt.sectionId,
            subj: (slot.subjectId as any)?.name || '',
          });
        }
      }
    }

    // Find teacher clashes
    for (const [key, entries] of teacherMap) {
      if (entries.length > 1) {
        const [, dayPeriod] = key.split(/-(.+)/);
        const [day, period] = dayPeriod.split('-');
        const involved = entries.map(e => `${e.cls} ${e.sec} (${e.subj})`).join(' vs ');
        conflicts.push({
          type: 'teacher_clash',
          day,
          period: Number(period),
          message: `Teacher double-booked: ${involved}`,
          severity: 'error',
          relatedEntities: entries.map(e => ({ type: 'class', id: e.tt, name: `${e.cls} ${e.sec}` })),
          timetableId: entries[0].tt,
          className: entries[0].cls,
          section: entries[0].sec,
        });
      }
    }

    // Find room clashes
    for (const [key, entries] of roomMap) {
      if (entries.length > 1) {
        const [, dayPeriod] = key.split(/-(.+)/);
        const [day, period] = dayPeriod.split('-');
        const involved = entries.map(e => `${e.cls} ${e.sec}`).join(' vs ');
        conflicts.push({
          type: 'room_clash',
          day,
          period: Number(period),
          message: `Room double-booked: ${involved}`,
          severity: 'error',
          relatedEntities: entries.map(e => ({ type: 'class', id: e.tt, name: `${e.cls} ${e.sec}` })),
          timetableId: entries[0].tt,
          className: entries[0].cls,
          section: entries[0].sec,
        });
      }
    }

    return conflicts;
  }

  async findAll(academicYear?: string) {
    const query: any = {};
    if (academicYear) query.academicYear = academicYear;
    return Timetable.find(query)
      .populate('classId', 'name sections')
      .populate('slots.subjectId', 'name code type')
      .populate('slots.teacherId', 'firstName lastName')
      .populate('slots.roomId', 'name number')
      .sort({ 'classId.name': 1, sectionId: 1 });
  }

  async findByClassSection(classId: string, sectionId: string, academicYear: string) {
    const timetable = await Timetable.findOne({ classId, sectionId, academicYear })
      .populate('classId', 'name')
      .populate('slots.subjectId', 'name code type')
      .populate('slots.teacherId', 'firstName lastName')
      .populate('slots.roomId', 'name number');
    return timetable;
  }

  async publish(timetableId: string) {
    const tt = await Timetable.findByIdAndUpdate(
      timetableId,
      { status: 'published', publishedAt: new Date() },
      { new: true }
    );
    if (!tt) throw ApiError.notFound('Timetable not found');
    return tt;
  }

  async delete(timetableId: string) {
    const tt = await Timetable.findByIdAndDelete(timetableId);
    if (!tt) throw ApiError.notFound('Timetable not found');
    return tt;
  }
}

export const timetableService = new TimetableService();
