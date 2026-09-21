import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiRefreshCw, FiCode, FiCheckCircle, FiTerminal, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CHALLENGES = [
  {
    title: 'Two Sum Algorithm (Tech Screening)',
    difficulty: 'Easy',
    starterCode: `// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test Run:
console.log("Result for [2, 7, 11, 15] Target 9 =>", twoSum([2, 7, 11, 15], 9));
`,
  },
  {
    title: 'Async Real-Time Data Fetcher',
    difficulty: 'Medium',
    starterCode: `// Simulate an asynchronous API retry handler for startup opportunities
async function fetchWithRetry(url, retries = 3) {
  console.log("Simulating fetch to:", url);
  return { status: 200, data: { matchedFounders: 5, score: "98%" } };
}

fetchWithRetry("https://api.startupforge.com/match")
  .then(res => console.log("API Success Response =>", JSON.stringify(res.data)));
`,
  },
  {
    title: 'Custom React Hook Simulation (useDebounce)',
    difficulty: 'Senior',
    starterCode: `// Debounce search function for live opportunity searching
function createDebounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = createDebounce((query) => console.log("Searching for =>", query), 300);
handleSearch("Senior Frontend Engineer");
console.log("Debounced function initialized successfully!");
`,
  },
];

export default function LiveCodeSandbox() {
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [code, setCode] = useState(CHALLENGES[0].starterCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);

  const handleSelectChallenge = (index) => {
    setSelectedChallenge(index);
    setCode(CHALLENGES[index].starterCode);
    setOutput('');
  };

  const handleRunCode = () => {
    setRunning(true);
    setOutput('');
    const logs = [];

    // Sandbox safe console override
    const originalLog = console.log;
    console.log = (...args) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    try {
      // Execute in sandbox environment
      const execute = new Function(code);
      execute();
      setOutput(logs.join('\n') || 'Code executed successfully with zero errors.');
      toast.success('Code executed successfully!');
    } catch (err) {
      setOutput(`⚠️ Runtime Error:\n${err.message}`);
      toast.error('Execution encountered an error');
    } finally {
      console.log = originalLog;
      setRunning(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
            <FiCode className="w-3.5 h-3.5" /> Technical Screening Environment
          </span>
          <h1 className="text-3xl font-black text-white">Live Code Sandbox & Technical Assessment</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Write, execute, and debug algorithms directly during live founder-collaborator interview sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunCode}
            disabled={running}
            className="btn-primary px-6 py-3.5 text-xs font-black shadow-xl shadow-indigo-600/30 flex items-center gap-2"
          >
            <FiPlay size={16} /> {running ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Challenge Tabs */}
      <div className="flex flex-wrap gap-3">
        {CHALLENGES.map((ch, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectChallenge(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
              selectedChallenge === idx
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <FiZap size={14} className={selectedChallenge === idx ? 'text-amber-300' : 'text-slate-500'} />
            <span>{ch.title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950/60 font-mono">
              {ch.difficulty}
            </span>
          </button>
        ))}
      </div>

      {/* Code Editor and Output Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Window */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 font-bold text-slate-300">Solution.js (JavaScript ES6+)</span>
            </span>
            <button
              onClick={() => setCode(CHALLENGES[selectedChallenge].starterCode)}
              className="hover:text-white flex items-center gap-1 transition-colors"
              title="Reset Code"
            >
              <FiRefreshCw size={12} /> Reset
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 p-5 bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-none"
            spellCheck="false"
          />
        </div>

        {/* Output Console Window */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-2 font-bold">
              <FiTerminal className="text-indigo-400" /> Execution Terminal Console
            </span>
            {output && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Executed
              </span>
            )}
          </div>

          <div className="flex-1 p-5 bg-slate-950 text-xs font-mono overflow-y-auto space-y-2">
            {output ? (
              <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <p className="text-slate-600">Click "Run Code" to compile and view real-time standard output...</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
