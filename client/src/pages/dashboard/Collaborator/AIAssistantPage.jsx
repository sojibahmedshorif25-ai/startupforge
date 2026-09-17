import { useState, useRef, useEffect } from 'react';
import { FiZap, FiSend, FiCopy, FiCheck, FiRefreshCw, FiUser } from 'react-icons/fi';
import api from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I am your dedicated StartupForge AI Assistant. Ask me anything about finding roles, crafting application motivation messages, negotiating founding equity, or honing in-demand startup skills.`,
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
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt) => {
    const query = customPrompt || input;
    if (!query.trim() || loading) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/assistant', {
        message: query,
        history: messages.slice(-8),
        context: {
          role: user?.role || 'collaborator',
          skills: user?.skills || ['React', 'JavaScript'],
        },
      });

      if (res.data.success && res.data.reply) {
        setMessages((prev) => [...prev, { sender: 'assistant', text: res.data.reply }]);
      } else {
        toast.error('Could not parse AI response');
      }
    } catch (err) {
      toast.error('AI assistant network error');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: 'Chat cleared. How can I assist you with your startup journey now?',
      },
    ]);
  };

  const suggestedPrompts = [
    'Help me write a motivation message for a Senior Fullstack role',
    'What skills should I learn for AI startup engineering?',
    'How do I pitch my experience to early-stage founders?',
    'Explain how startup equity and commitment levels work',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 flex items-center justify-between flex-shrink-0 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300">
            <FiZap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              StartupForge AI Assistant Console
            </h1>
            <p className="text-xs text-slate-300">Ask questions, generate application letters, and get career advice.</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <FiRefreshCw className="w-3.5 h-3.5" /> Clear Chat
        </button>
      </div>

      {/* Chat Messages Console */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 overflow-y-auto space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap relative group shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold opacity-80 uppercase tracking-wider">
                {msg.sender === 'user' ? (
                  <>
                    <FiUser className="w-3 h-3" /> You
                  </>
                ) : (
                  <>
                    <FiZap className="w-3 h-3 text-indigo-400" /> AI Assistant
                  </>
                )}
              </div>
              {msg.text}

              {msg.sender === 'assistant' && (
                <button
                  onClick={() => copyText(msg.text, idx)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 shadow-sm"
                  title="Copy message"
                >
                  {copiedIdx === idx ? <FiCheck className="w-3.5 h-3.5 text-emerald-500" /> : <FiCopy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <FiZap className="w-4 h-4 text-indigo-500 animate-spin" /> Thinking & generating AI response...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 flex-shrink-0">
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold border border-slate-200 dark:border-slate-800 transition-all shadow-sm"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-3 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask StartupForge AI Assistant anything..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          Send <FiSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
