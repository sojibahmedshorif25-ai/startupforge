import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSend, FiVideo, FiUser } from 'react-icons/fi';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LiveChatModal({ isOpen, onClose, app, currentUser, onStartVideoCall }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const roomId = app ? `chat_${app._id || app.id}` : 'default_room';

  useEffect(() => {
    if (!isOpen || !app) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    newSocket.emit('join_room', roomId);
    setSocket(newSocket);

    // Initial conversation state
    setMessages([
      {
        sender: app.applicant_email === currentUser?.email ? 'founder' : 'applicant',
        text: `Hi! Thank you for applying for ${app.opportunity_id?.role_title || 'the role'}. Excited to talk!`,
        time: 'Just now',
      },
    ]);

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isOpen, app, roomId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    const msgData = {
      roomId,
      sender: currentUser?.email || 'user',
      senderName: currentUser?.name || 'User',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('send_message', msgData);
    setMessages((prev) => [...prev, msgData]);
    setInputMessage('');
  };

  if (!isOpen || !app) return null;

  const partnerName = currentUser?.role === 'founder' 
    ? app.applicant_name || app.applicant_email 
    : 'Startup Founder';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col h-[550px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              <FiUser size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                {partnerName}
              </h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {app.opportunity_id?.role_title || 'Position Interview Chat'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onStartVideoCall && onStartVideoCall(roomId);
                toast.success('Launching HD Video Call...');
              }}
              className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-all font-bold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-500/30"
              title="Start HD Video Call"
            >
              <FiVideo size={16} />
              <span className="hidden sm:inline">Start Video</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
          {messages.map((msg, idx) => {
            const isMe = msg.sender === currentUser?.email;
            return (
              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs font-medium shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] mt-1 block text-right font-mono ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message live..."
            className="input-field text-xs flex-1"
          />
          <button type="submit" className="btn-primary px-4 py-3 text-xs font-bold shrink-0">
            <FiSend size={14} />
            <span>Send</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
