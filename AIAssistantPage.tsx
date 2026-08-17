import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, Loader2, Clock, Lightbulb, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: '📊', label: 'Student report', prompt: 'Give me a summary report for Class 10-A this month' },
  { icon: '📅', label: 'Schedule conflict', prompt: 'Are there any timetable conflicts for tomorrow?' },
  { icon: '💰', label: 'Fee status', prompt: 'How many students have overdue fees in Class 10?' },
  { icon: '📈', label: 'Performance trend', prompt: 'What is the attendance trend for this semester?' },
  { icon: '🎓', label: 'At-risk students', prompt: 'Which students are at risk of failing based on their attendance and exam scores?' },
  { icon: '👩‍🏫', label: 'Teacher workload', prompt: 'Show me teacher workload distribution for this week' },
];

const mockResponses: Record<string, string> = {
  'default': `I'd be happy to help! I'm the EduNexus AI Assistant, designed to help you manage your school operations efficiently. I can help with:

• **Student & Attendance Data** — Reports, trends, at-risk identification
• **Academic Performance** — Exam analysis, grade distribution, subject insights
• **Timetable Management** — Conflict detection, teacher workload balancing
• **Fee Management** — Collection status, outstanding payments, forecasting
• **Document Processing** — Extract data from scanned forms and certificates

What would you like to know?`,

  'class 10': `## 📊 Class 10-A Summary — August 2025

**Students:** 20 enrolled, 19 active

### Attendance
- Monthly avg: **92.4%** (↑ 2.1% from July)
- Students with < 80% attendance: **2** (Diya Gupta: 68%, Dev Rajput: 75%)
- Perfect attendance: **8 students**

### Academic Performance
- Last exam avg: **78.6%** 
- Topper: **Ananya Sharma** (96%)
- Subjects needing attention: Mathematics (72% avg)

### Fees
- Collection rate: **75%** (₹93,750 / ₹1,25,000)
- Overdue: **2 students** (Diya Gupta, Aditi Mehta)

### 🤖 AI Recommendation
> Consider scheduling a parent-teacher meeting for students with attendance below 80%. There's a strong correlation between attendance and exam performance in this class.`,

  'conflict': `## 📅 Timetable Conflicts — Tomorrow (Wednesday)

✅ **No critical conflicts detected!**

However, I found **1 advisory notice:**

⚠️ **Period 3, Wednesday:**
Prof. Rajesh Sharma is scheduled for both Class 10-A (Mathematics) and Class 9-B (Mathematics). This was flagged during generation but auto-resolved by assigning Class 9-B to Period 5.

### Teacher Availability Summary
| Teacher | Periods Tomorrow | Max Allowed | Status |
|---|---|---|---|
| Prof. Rajesh S. | 6 | 6 | ⚠️ At capacity |
| Dr. Priya P. | 4 | 6 | ✅ Available |
| Prof. Suresh N. | 5 | 6 | ✅ Available |

Need me to optimize any schedules?`,

  'fee': `## 💰 Fee Status — Class 10

### Collection Overview
- **Total Expected:** ₹2,50,000
- **Collected:** ₹1,87,500 (75%)
- **Pending:** ₹62,500

### Overdue Students (2)
| Student | Amount Due | Days Overdue |
|---|---|---|
| Diya Gupta | ₹12,500 | 36 days |
| Aditi Mehta | ₹12,500 | 36 days |

### Partial Payments (2)
| Student | Paid | Balance |
|---|---|---|
| Arjun Singh | ₹8,000 | ₹4,500 |
| Sneha Nair | ₹5,000 | ₹7,500 |

### 🤖 AI Recommendation
> Send automated payment reminders to overdue students. Based on past data, SMS reminders have a 78% response rate within 48 hours.`,

  'attendance': `## 📈 Attendance Trend — Semester 1 (2025-26)

| Month | Rate | Trend |
|---|---|---|
| April | 94% | — |
| May | 91% | ↓ 3% |
| June | 88% | ↓ 3% |
| July | 92% | ↑ 4% |
| August | 92.4% | ↑ 0.4% |

### Key Observations
- **Dip in June** correlates with pre-summer exam stress
- **Recovery in July** after parent engagement initiative
- **August trending stable** with monsoon season

### 🤖 AI Prediction
> September attendance is projected at **93-94%** based on historical patterns. The school assembly initiative started in July appears to have a positive impact.`,

  'risk': `## 🎓 At-Risk Students — AI Analysis

Based on combined attendance, exam scores, and trend analysis:

### 🔴 High Risk (2 students)
| Student | Class | Attendance | Academic | Key Concern |
|---|---|---|---|---|
| Diya Gupta | 10-A | 68% | 42% | Chronic absenteeism + failing grades |
| Dev Rajput | 10-A | 75% | 48% | Declining trend in last 3 months |

### 🟡 Medium Risk (2 students)
| Student | Class | Attendance | Academic | Key Concern |
|---|---|---|---|---|
| Karan Thakur | 10-A | 72% | 55% | Below avg in Mathematics |
| Nisha Pillai | 10-A | 80% | 52% | Inconsistent performance |

### 🤖 Recommended Interventions
1. **Diya Gupta** — Schedule parent meeting ASAP. Recommend academic support classes.
2. **Dev Rajput** — Assign a peer tutor. Monitor weekly attendance.
3. **Karan & Nisha** — Extra coaching in weak subjects. Monthly progress check.`,

  'teacher': `## 👩‍🏫 Teacher Workload — This Week

| Teacher | Periods/Week | Max | Utilization | Status |
|---|---|---|---|---|
| Prof. Rajesh Sharma | 38 | 30 | 127% | 🔴 Overloaded |
| Dr. Priya Patel | 24 | 30 | 80% | ✅ Normal |
| Prof. Suresh Nair | 28 | 30 | 93% | ⚠️ Near capacity |
| Dr. Meena Iyer | 22 | 30 | 73% | ✅ Available |
| Prof. Anil Kumar | 26 | 30 | 87% | ✅ Normal |
| Prof. Kavita Reddy | 20 | 30 | 67% | ✅ Available |

### 🤖 AI Recommendation
> **Prof. Rajesh Sharma** is 27% over capacity. Recommend transferring 8 periods of Class 8 Mathematics to Dr. Meena Iyer (who has availability and qualifications). This would bring both teachers within optimal range.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('class 10') || lower.includes('summary') || lower.includes('report')) return mockResponses['class 10'];
  if (lower.includes('conflict') || lower.includes('timetable') || lower.includes('schedule')) return mockResponses['conflict'];
  if (lower.includes('fee') || lower.includes('payment') || lower.includes('overdue')) return mockResponses['fee'];
  if (lower.includes('attendance') || lower.includes('trend')) return mockResponses['attendance'];
  if (lower.includes('risk') || lower.includes('failing') || lower.includes('at-risk')) return mockResponses['risk'];
  if (lower.includes('teacher') || lower.includes('workload')) return mockResponses['teacher'];
  return mockResponses['default'];
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: `Hello! 👋 I'm the **EduNexus AI Assistant**.\n\nI can analyze your school data and provide actionable insights. Ask me about attendance, grades, fees, timetable conflicts, or student performance.\n\nTry one of the quick prompts below, or type your question!`, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      const assistantMsg: Message = { id: `a${Date.now()}`, role: 'assistant', content: response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#111111]">AI Assistant</h1>
          <p className="text-xs text-[#8A8A8A] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online · Analyzing school data
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl border-l-4 border-l-[#111111] border-y-[#EAEAEA] border-r-[#EAEAEA] bg-[#F7F7F7] p-4 space-y-4 mb-4">
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={cn('max-w-[75%] rounded-2xl px-4 py-3 group relative border', msg.role === 'user' ? 'bg-[#F7F7F7] border-[#EAEAEA]' : 'bg-white border-[#EAEAEA] shadow-sm')}>
              {/* Render content with basic markdown */}
              <div className="text-sm text-[#333333] leading-relaxed whitespace-pre-wrap">
                {msg.content.split('\\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-bold text-[#111111] mt-2 mb-1">{line.replace('## ', '')}</h3>;
                  if (line.startsWith('### ')) return <h4 key={i} className="text-xs font-semibold text-[#666666] mt-2 mb-1">{line.replace('### ', '')}</h4>;
                  if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-[#111111] pl-3 text-xs text-[#666666] italic my-1">{line.replace('> ', '')}</blockquote>;
                  if (line.startsWith('| ')) return <p key={i} className="text-[11px] text-[#8A8A8A] font-mono">{line}</p>;
                  if (line.startsWith('- ') || line.startsWith('• ')) return <p key={i} className="text-xs text-[#333333] ml-2">{line}</p>;
                  if (line.match(/^\\d\\. /)) return <p key={i} className="text-xs text-[#333333] ml-2">{line}</p>;
                  if (line === '') return <br key={i} />;
                  return <p key={i} className="text-xs text-[#333333]">{line.replace(/\\*\\*(.*?)\\*\\*/g, '$1')}</p>;
                })}
              </div>
              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyMessage(msg.id, msg.content)}
                  className="absolute top-2 right-2 p-1 rounded text-[#8A8A8A] hover:text-[#111111] opacity-0 group-hover:opacity-100 transition-all"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
              <p className="text-[9px] text-[#999999] mt-1.5">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#EAEAEA] flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-[#666666]" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-[#111111] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white border border-[#EAEAEA] shadow-sm rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#111111] animate-spin" />
              <span className="text-xs text-[#8A8A8A]">Analyzing data...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
        {quickPrompts.map(q => (
          <button key={q.label} onClick={() => sendMessage(q.prompt)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#F7F7F7] hover:border-[#DCDCDC] transition-all whitespace-nowrap flex-shrink-0">
            <span>{q.icon}</span> {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about attendance, grades, fees, or any school data..."
            className="w-full px-4 py-3 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] pr-12"
          />
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isTyping}
          className="w-11 h-11 rounded-xl bg-[#111111] flex items-center justify-center text-white hover:bg-[#1A1A1A] transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
