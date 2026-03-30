import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, ChevronDown, Sparkles, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const FAQS = [
  { 
    question: "How to enroll a new student?", 
    keywords: ["enroll", "add student", "new student", "register"],
    answer: "To enroll a new student, click the dark 'Enroll' button in the top right corner of the dashboard. This will open the student registration form where you can enter their personal and academic details." 
  },
  { 
    question: "Where can I view student fees?", 
    keywords: ["fee", "payment", "fiscal", "money", "dues"],
    answer: "Navigate to the 'Fiscal Oversight' section in the sidebar. There you can see a list of students, their total fees, paid amounts, and remaining balances. You can also record new payments there." 
  },
  { 
    question: "How to mark attendance?", 
    keywords: ["attendance", "presence", "mark", "absent", "present"],
    answer: "Go to the 'Presence Registry' section in the sidebar. You can record daily attendance for students, view attendance summaries, and check the overall presence percentage on the dashboard." 
  },
  { 
    question: "How to manage exams and results?", 
    keywords: ["exam", "assessment", "result", "test", "marks"],
    answer: "The 'Assessment Board' section is dedicated to managing examinations, grading, and viewing student results. You can access it from the sidebar." 
  },
  { 
    question: "Where to manage teachers?", 
    keywords: ["teacher", "faculty", "staff", "academic"],
    answer: "Use the 'Faculty Structure' module in the sidebar to manage teacher assignments, academic departments, and institutional hierarchy." 
  },
  { 
    question: "How to search for a student?", 
    keywords: ["search", "find", "locate", "lookup"],
    answer: "Use the search bar in the top header. You can search by student name, email, or district. The list will filter in real-time as you type." 
  },
  { 
    question: "Is there a dark mode?", 
    keywords: ["dark", "light", "theme", "mode", "color", "appearance"],
    answer: "Yes! There is a sun/moon icon in the top header (next to settings). Clicking it will toggle between the premium Dark mode and the standard Light mode." 
  },
  { 
    question: "How to logout or change settings?", 
    keywords: ["logout", "exit", "sign out", "settings", "config"],
    answer: "The logout button (red icon) is located in the top header. System settings and language options can be found in the adjacent gear icon dropdown." 
  },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your JANAGAMANA Institutional Assistant. How can I assist you with your administrative tasks today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI Response Logic
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let responseText = "I apologize, but I couldn't find a specific answer for that. Please try asking about 'enrollment', 'fees', 'attendance', 'exams', or 'dark mode'. Alternatively, contact the system administrator.";

      // Improved keyword matching
      const matchedFaq = FAQS.find(faq => 
        faq.keywords.some(keyword => lowerText.includes(keyword)) ||
        lowerText.includes(faq.question.toLowerCase())
      );

      if (matchedFaq) {
        responseText = matchedFaq.answer;
      } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        const greetings = [
          "Greetings! How may I assist with your institutional tasks today?",
          "Hello there! Ready to manage some student records?",
          "Hi! I'm here to help you navigate the system."
        ];
        responseText = greetings[Math.floor(Math.random() * greetings.length)];
      } else if (lowerText.includes('thanks') || lowerText.includes('thank you')) {
        responseText = "You're very welcome! Let me know if you need anything else.";
      } else if (lowerText.includes('who are you') || lowerText.includes('what is this')) {
        responseText = "I am the JANAGAMANA AI Assistant, designed to help you quickly navigate and manage this Student Management System.";
      } else if (lowerText.includes('help') || lowerText.includes('guide') || lowerText.includes('menu')) {
        responseText = "I can help you with: Enrollment, Fees, Attendance, Academic management, Exams, and General settings. What would you like to know more about?";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Bubble Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 group ${
          isOpen 
            ? 'bg-rose-500 rotate-90 scale-90' 
            : 'bg-navy-950 hover:bg-navy-900 hover:scale-110 active:scale-95'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <div className="relative">
            <MessageCircle className="text-white" size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-navy-950 rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-10rem)] glass-panel rounded-3xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-navy-950 p-5 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Bot size={22} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">Assistant</h4>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if(confirm('Clear conversation history?')) {
                  setMessages([{
                    id: '1',
                    text: "Conversation cleared. How else can I help you?",
                    sender: 'bot',
                    timestamp: new Date(),
                  }]);
                }
              }}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
              title="Clear Chat"
            >
              <Trash2 size={16} />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
            >
              <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-navy-950 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1.5 opacity-50 font-black uppercase text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1 w-8">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* FAQ Suggestions */}
        {messages.length < 4 && (
          <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
              <Sparkles size={10} className="text-indigo-500" />
              Suggested Queries
            </p>
            <div className="flex flex-wrap gap-2">
              {FAQS.slice(0, 4).map((faq, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(faq.question)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-navy-600 dark:text-indigo-400 hover:border-indigo-500 transition-all active:scale-95"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none outline-none px-4 py-2.5 rounded-xl text-sm font-medium placeholder:text-slate-400 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-navy-950 text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-900 transition-colors shadow-lg shadow-navy-950/10"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
