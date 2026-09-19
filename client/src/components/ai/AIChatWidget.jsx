import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMessageSquare, FiX, FiSend, FiZap, FiCopy, FiCheck, FiMinimize2 } from 'react-icons/fi';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

export default function AIChatWidget() {
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === '/dashboard/ai-assistant') return null;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "👋 Hi! I'm StartupForge AI Assistant. Ask me about finding opportunities, writing application letters, or matching your skills to startups!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage = { sender: 'user', text: queryText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/assistant', {
        message: queryText,
        history: messages.slice(-6),
        context: {
          role: user?.role || 'collaborator',
          skills: user?.skills || ['React', 'JavaScript'],
        },
      });

      if (res.data.success && res.data.reply) {
        setMessages((prev) => [...prev, { sender: 'assistant', text: res.data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: 'I could not generate a response right now. Please try rephrasing your question.',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue connecting to the AI assistant server.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const prompts = [
    'Which opportunities fit my skills?',
    'Help me write a motivation message',
    'What skills are in demand for startups?',
  ];

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-medium rounded-full shadow-2xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/30"
        >
          <FiZap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold tracking-wide">AI Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[380px] h-[480px] sm:h-[520px] max-h-[70vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400/30">
                <FiZap className="w-5 h-5 text-indigo-300 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  StartupForge AI <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">Live</span>
                </h3>
                <p className="text-[11px] text-slate-300">Always here to help you build & apply</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiMinimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap relative group ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80 shadow-sm'
                  }`}
                >
                  {msg.text}

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.text, idx)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-700 rounded shadow-xs"
                      title="Copy response"
                    >
                      {copiedIdx === idx ? <FiCheck className="w-3 h-3 text-emerald-500" /> : <FiCopy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="px-3.5 py-2.5 bg-white dark:bg-slate-800 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Assistant anything..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
