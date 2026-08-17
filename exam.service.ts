import { Exam } from './exam.model.js';
import { ApiError } from '../../utils/ApiError.js';

export class ExamService {
  async create(data: any) {
    const exam = await Exam.create(data);
    return exam.populate([
      { path: 'classId', select: 'name' },
      { path: 'subjects.subjectId', select: 'name code' },
    ]);
  }

  async findAll(query: { classId?: string; academicYear?: string; status?: string; type?: string }) {
    const filter: any = {};
    if (query.classId) filter.classId = query.classId;
    if (query.academicYear) filter.academicYear = query.academicYear;
    if (query.status) filter.status = query.status;
    if (query.type) filter.type = query.type;

    return Exam.find(filter)
      .populate('classId', 'name')
      .populate('subjects.subjectId', 'name code')
      .sort({ startDate: -1 });
  }

  async findById(id: string) {
    const exam = await Exam.findById(id)
      .populate('classId', 'name')
      .populate('subjects.subjectId', 'name code')
      .populate('results.studentId', 'firstName lastName admissionNumber')
      .populate('results.scores.subjectId', 'name code');
    if (!exam) throw ApiError.notFound('Exam not found');
    return exam;
  }

  async update(id: string, data: any) {
    const exam = await Exam.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('classId', 'name')
      .populate('subjects.subjectId', 'name code');
    if (!exam) throw ApiError.notFound('Exam not found');
    return exam;
  }

  async delete(id: string) {
    const exam = await Exam.findByIdAndDelete(id);
    if (!exam) throw ApiError.notFound('Exam not found');
    return exam;
  }

  /**
   * Submit results for an exam — calculates totals, percentages, grades, and ranks
   */
  async submitResults(examId: string, results: { studentId: string; scores: { subjectId: string; marksObtained: number }[] }[]) {
    const exam = await Exam.findById(examId);
    if (!exam) throw ApiError.notFound('Exam not found');

    const gradeScale = [
      { min: 90, grade: 'A+' },
      { min: 80, grade: 'A' },
      { min: 70, grade: 'B+' },
      { min: 60, grade: 'B' },
      { min: 50, grade: 'C' },
      { min: 40, grade: 'D' },
      { min: 0, grade: 'F' },
    ];

    const processedResults = results.map(r => {
      let totalMarks = 0;
      let totalMaxMarks = 0;

      const scores = r.scores.map(s => {
        const subjectConfig = exam.subjects.find(sub => String(sub.subjectId) === s.subjectId);
        const maxMarks = subjectConfig?.maxMarks || 100;
        const passingMarks = subjectConfig?.passingMarks || 33;
        totalMarks += s.marksObtained;
        totalMaxMarks += maxMarks;

        const subjectGrade = gradeScale.find(g => (s.marksObtained / maxMarks) * 100 >= g.min)?.grade || 'F';

        return {
          subjectId: s.subjectId,
          maxMarks,
          passingMarks,
          marksObtained: s.marksObtained,
          grade: subjectGrade,
        };
      });

      const percentage = totalMaxMarks > 0 ? Math.round((totalMarks / totalMaxMarks) * 10000) / 100 : 0;
      const grade = gradeScale.find(g => percentage >= g.min)?.grade || 'F';

      return {
        studentId: r.studentId,
        scores,
        totalMarks,
        totalMaxMarks,
        percentage,
        grade,
      };
    });

    // Assign ranks
    processedResults.sort((a, b) => b.percentage - a.percentage);
    processedResults.forEach((r, i) => { (r as any).rank = i + 1; });

    exam.results = processedResults as any;
    exam.status = 'completed';
    await exam.save();

    return exam.populate([
      { path: 'results.studentId', select: 'firstName lastName admissionNumber' },
      { path: 'results.scores.subjectId', select: 'name code' },
    ]);
  }

  async publishResults(examId: string) {
    const exam = await Exam.findByIdAndUpdate(examId, { status: 'results_published' }, { new: true });
    if (!exam) throw ApiError.notFound('Exam not found');
    return exam;
  }

  async getStats(classId?: string, academicYear?: string) {
    const filter: any = {};
    if (classId) filter.classId = classId;
    if (academicYear) filter.academicYear = academicYear;

    const exams = await Exam.find(filter);
    const total = exams.length;
    const scheduled = exams.filter(e => e.status === 'scheduled').length;
    const completed = exams.filter(e => e.status === 'completed' || e.status === 'results_published').length;

    // Average performance across completed exams
    const completedExams = exams.filter(e => e.results.length > 0);
    let avgPercentage = 0;
    if (completedExams.length > 0) {
      const totalPct = completedExams.reduce((sum, e) => {
        const examAvg = e.results.reduce((s, r) => s + r.percentage, 0) / e.results.length;
        return sum + examAvg;
      }, 0);
      avgPercentage = Math.round(totalPct / completedExams.length);
    }

    return { total, scheduled, completed, avgPercentage };
  }
}

export const examService = new ExamService();
