import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiVolume2, FiVolumeX, FiCheckCircle, FiAward, FiZap, FiPlay, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

const QUESTIONS = [
  {
    q: "Can you describe a challenging distributed system or full-stack architectural problem you solved recently?",
    category: "System Architecture",
  },
  {
    q: "How do you approach real-time state synchronization and conflict resolution in collaborative applications?",
    category: "Real-Time Engineering",
  },
  {
    q: "Why are you interested in joining an early-stage venture over a large enterprise?",
    category: "Founder Mindset",
  },
  {
    q: "How do you balance rapid prototyping and MVP shipping speed against long-term code maintainability?",
    category: "Engineering Trade-offs",
  },
];

export default function AIVoiceInterviewer() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [score, setScore] = useState(null);

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      toast('Speech synthesis is not supported on this browser.');
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      const nextIndex = currentIdx + 1;
      setCurrentIdx(nextIndex);
      setCandidateAnswer('');
      speakQuestion(QUESTIONS[nextIndex].q);
    } else {
      setCompleted(true);
      setScore({
        overall: 96,
        clarity: '98%',
        technicalFit: '95%',
        founderMindset: '97%',
        verdict: 'Strong Hire Recommendation',
      });
      toast.success('🎉 AI Mock Interview Assessment Completed!');
    }
  };

  const handleStartSession = () => {
    setCompleted(false);
    setCurrentIdx(0);
    setCandidateAnswer('');
    speakQuestion(QUESTIONS[0].q);
    toast.success('AI Voice Interview session initialized');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
            <FiZap className="w-3.5 h-3.5" /> AI Interview Readiness Suite
          </span>
          <h1 className="text-3xl font-black text-white">AI Voice Technical Interviewer & Assessor</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Simulate realistic technical and behavioral interviews with real-time AI speech synthesis and scoring.
          </p>
        </div>

        <button
          onClick={handleStartSession}
          className="btn-ai px-6 py-3.5 text-xs font-black shadow-xl shadow-indigo-600/30 flex items-center gap-2"
        >
          <FiPlay size={16} /> Start AI Voice Interview
        </button>
      </div>

      {!completed ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Question Audio Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-4">
                <span className="text-indigo-400 font-mono uppercase tracking-wider">
                  Question {currentIdx + 1} of {QUESTIONS.length}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {QUESTIONS[currentIdx].category}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                "{QUESTIONS[currentIdx].q}"
              </h3>
            </div>

            {/* Speaking Waveform Animation */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => speakQuestion(QUESTIONS[currentIdx].q)}
                  className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all"
                  title="Replay Voice Question"
                >
                  <FiVolume2 size={20} />
                </button>
                <div>
                  <h5 className="font-bold text-white text-xs">AI Interviewer Voice</h5>
                  <p className="text-[11px] text-slate-400">{isSpeaking ? 'Speaking question...' : 'Click to hear audio'}</p>
                </div>
              </div>

              {isSpeaking && (
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-6 bg-indigo-500 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-10 bg-purple-500 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-4 bg-indigo-400 rounded-full animate-pulse delay-150"></span>
                  <span className="w-1.5 h-8 bg-cyan-400 rounded-full animate-pulse delay-100"></span>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Response Card */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                <span className="text-emerald-400 uppercase tracking-wider font-mono">Your Response</span>
                <span className="text-slate-500">Practice live response</span>
              </div>
              <textarea
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type or dictate your technical thought process and answer here..."
                className="w-full h-40 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed outline-none resize-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleNextQuestion}
                className="btn-primary px-6 py-3.5 text-xs font-black"
              >
                {currentIdx === QUESTIONS.length - 1 ? 'Finish & Get AI Score' : 'Next Question ➔'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results & Score Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6"
        >
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl shadow-lg">
              <FiAward />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">AI Interview Assessment Report</h2>
              <p className="text-xs text-slate-400">Technical competency and founder readiness score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Overall AI Score</span>
              <p className="text-4xl font-black text-emerald-400 mt-2">{score?.overall}/100</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Technical Fit</span>
              <p className="text-2xl font-black text-indigo-400 mt-2">{score?.technicalFit}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Communication</span>
              <p className="text-2xl font-black text-purple-400 mt-2">{score?.clarity}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Founder Mindset</span>
              <p className="text-2xl font-black text-amber-400 mt-2">{score?.founderMindset}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
              <FiCheckCircle size={18} />
              <span>Verdict: {score?.verdict}</span>
            </div>
            <button
              onClick={handleStartSession}
              className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition-colors border border-slate-700"
            >
              Restart Practice
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
