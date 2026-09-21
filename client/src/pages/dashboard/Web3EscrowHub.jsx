import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiUnlock, FiCheckCircle, FiDollarSign, FiPlus, FiCpu, FiExternalLink, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Web3EscrowHub() {
  const [walletConnected, setWalletConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('0x71C...498f');
  const [balance, setBalance] = useState(5400); // 5,400 USDC

  const [milestones, setMilestones] = useState([
    {
      id: 'ms_1',
      title: 'Milestone 1: AI Model Integration & Vector Indexing',
      amount: 1200,
      collaborator: 'Sarah Chen (sarah.founder@healthai.com)',
      status: 'locked', // 'locked' | 'submitted' | 'released'
      txHash: '0x8f2a1b9e7d3c4568901234abcdef567890abcdef',
      updatedAt: 'Today, 11:30 AM',
    },
    {
      id: 'ms_2',
      title: 'Milestone 2: WebRTC HD Video Calling & Screen Sharing',
      amount: 1500,
      collaborator: 'John Developer (dev.john@gmail.com)',
      status: 'submitted',
      txHash: '0x3c7e9f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
      updatedAt: 'Yesterday, 4:15 PM',
    },
    {
      id: 'ms_3',
      title: 'Milestone 3: Stripe Checkout & Production Cloud Deployment',
      amount: 800,
      collaborator: 'Alex Rivera (alex.founder@techvision.io)',
      status: 'released',
      txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      updatedAt: '2 days ago',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');

  const handleCreateMilestone = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount || !newCollaborator) {
      return toast.error('Please fill all milestone fields');
    }
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) return toast.error('Enter a valid USDC amount');
    if (amt > balance) return toast.error('Insufficient USDC wallet balance');

    const newMilestone = {
      id: `ms_${Date.now()}`,
      title: newTitle,
      amount: amt,
      collaborator: newCollaborator,
      status: 'locked',
      txHash: `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`,
      updatedAt: 'Just now',
    };

    setMilestones([newMilestone, ...milestones]);
    setBalance((prev) => prev - amt);
    setNewTitle('');
    setNewAmount('');
    setNewCollaborator('');
    toast.success(`🔐 ${amt} USDC locked into Smart Contract Escrow!`);
  };

  const handleReleaseFunds = (id, amount) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: 'released' } : m))
    );
    toast.success(`🎉 ${amount} USDC Smart Contract Escrow Released to Collaborator!`);
  };

  const handleMarkSubmitted = (id) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, status: 'submitted' } : m))
    );
    toast.success('Milestone deliverables submitted for Founder review!');
  };

  const totalLocked = milestones
    .filter((m) => m.status === 'locked' || m.status === 'submitted')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalReleased = milestones
    .filter((m) => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
            <FiCpu className="w-3.5 h-3.5" /> Polygon & USDC Smart Contract Escrow
          </span>
          <h1 className="text-3xl font-black text-white">Web3 Milestone Escrow Protocol</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Lock funds securely in decentralized escrow smart contracts. Automatically release milestone payouts to collaborators upon task verification.
          </p>
        </div>

        {/* Web3 Wallet Pill */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-lg flex items-center space-x-3.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Connected Wallet (Polygon)</p>
            <p className="text-xs font-mono font-bold text-white">{walletAddress}</p>
          </div>
          <div className="pl-3 border-l border-slate-800">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Balance</p>
            <p className="text-sm font-black text-emerald-400">${balance.toLocaleString()} USDC</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Escrow Locked</span>
            <FiLock className="text-amber-400" size={18} />
          </div>
          <p className="text-3xl font-black text-amber-400">${totalLocked.toLocaleString()} USDC</p>
          <p className="text-[11px] text-slate-400">Guaranteed in Smart Contracts</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Total Milestone Released</span>
            <FiUnlock className="text-emerald-400" size={18} />
          </div>
          <p className="text-3xl font-black text-emerald-400">${totalReleased.toLocaleString()} USDC</p>
          <p className="text-[11px] text-slate-400">Paid out to verified builders</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Active Smart Contracts</span>
            <FiShield className="text-indigo-400" size={18} />
          </div>
          <p className="text-3xl font-black text-white">{milestones.length} Contracts</p>
          <p className="text-[11px] text-indigo-400 font-bold">100% On-Chain Verifiable</p>
        </div>
      </div>

      {/* Main Grid: Create Escrow Form + Milestone Agreements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Create Milestone Escrow */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 h-fit">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FiLock className="text-indigo-400" /> Create Escrow Milestone
            </h3>
            <p className="text-xs text-slate-400 mt-1">Lock USDC into smart contract for a project task</p>
          </div>

          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Milestone Deliverable Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Build Real-time WebRTC Video Calling Room"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Escrow Payout Amount (USDC)
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="number"
                  required
                  placeholder="500"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="input-field pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Assigned Collaborator Email
              </label>
              <input
                type="email"
                required
                placeholder="collaborator@dev.io"
                value={newCollaborator}
                onChange={(e) => setNewCollaborator(e.target.value)}
                className="input-field text-xs"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3.5 text-xs font-black shadow-xl shadow-indigo-600/30">
              <FiLock size={14} /> Deposit & Lock in Smart Contract
            </button>
          </form>
        </div>

        {/* Right: Milestone Contracts List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <FiShield className="text-emerald-400" /> Milestone Contracts
            </h3>
            <span className="text-xs text-slate-400 font-mono">Polygon Mainnet Protocol</span>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm leading-snug">{m.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">Recipient: <span className="text-slate-300 font-medium">{m.collaborator}</span></p>
                  </div>
                  <span className="text-base font-black text-emerald-400 shrink-0">
                    ${m.amount} USDC
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                        m.status === 'locked'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : m.status === 'submitted'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {m.status === 'locked' ? '🔒 Locked in Escrow' : m.status === 'submitted' ? '📩 Deliverable Submitted' : '✅ Payout Released'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {m.status === 'locked' && (
                      <button
                        onClick={() => handleMarkSubmitted(m.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 font-bold text-xs"
                      >
                        Submit Work
                      </button>
                    )}
                    {m.status === 'submitted' && (
                      <button
                        onClick={() => handleReleaseFunds(m.id, m.amount)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                      >
                        Approve & Release Funds
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="truncate max-w-[260px]">TxHash: {m.txHash}</span>
                  <span>{m.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
