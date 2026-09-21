import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiUsers, FiPlus, FiTrash2, FiDownload } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

export default function CapTableCalculator() {
  const [investment, setInvestment] = useState(250000);
  const [preMoneyValuation, setPreMoneyValuation] = useState(2000000);

  const [shareholders, setShareholders] = useState([
    { id: 1, name: 'Lead Founder (You)', sharesPercent: 55 },
    { id: 2, name: 'Co-Founder / CTO', sharesPercent: 25 },
    { id: 3, name: 'Employee Option Pool (ESOP)', sharesPercent: 10 },
    { id: 4, name: 'Angel Investor', sharesPercent: 10 },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPercent, setNewMemberPercent] = useState('');

  const postMoneyValuation = preMoneyValuation + investment;
  const investorDilution = ((investment / postMoneyValuation) * 100).toFixed(1);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPercent) {
      return toast.error('Please enter name and equity percentage');
    }
    const percent = parseFloat(newMemberPercent);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      return toast.error('Enter a valid percentage between 1 and 100');
    }

    setShareholders([
      ...shareholders,
      { id: Date.now(), name: newMemberName, sharesPercent: percent },
    ]);
    setNewMemberName('');
    setNewMemberPercent('');
    toast.success('Shareholder added to Cap Table');
  };

  const handleRemoveMember = (id) => {
    setShareholders(shareholders.filter((s) => s.id !== id));
    toast('Shareholder removed');
  };

  const chartData = shareholders.map((s) => ({
    name: s.name,
    value: s.sharesPercent,
  }));

  const totalAllocated = shareholders.reduce((sum, s) => sum + s.sharesPercent, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-2xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 mb-3">
          <FiPieChart className="w-3.5 h-3.5" /> Founder Financial Tools
        </span>
        <h1 className="text-3xl font-black text-white">Startup Valuation & Cap Table Simulator</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Simulate investment rounds, calculate post-money equity dilution, and model your cap table splits.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Pre-Money Valuation</span>
            <FiTrendingUp className="text-indigo-400" size={18} />
          </div>
          <p className="text-3xl font-black text-white">${preMoneyValuation.toLocaleString()}</p>
          <input
            type="range"
            min="500000"
            max="10000000"
            step="100000"
            value={preMoneyValuation}
            onChange={(e) => setPreMoneyValuation(Number(e.target.value))}
            className="w-full accent-indigo-500 mt-2"
          />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Funding / Investment Target</span>
            <FiDollarSign className="text-emerald-400" size={18} />
          </div>
          <p className="text-3xl font-black text-white">${investment.toLocaleString()}</p>
          <input
            type="range"
            min="50000"
            max="3000000"
            step="25000"
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full accent-emerald-500 mt-2"
          />
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Post-Money Valuation</span>
            <FiPieChart className="text-purple-400" size={18} />
          </div>
          <p className="text-3xl font-black text-white">${postMoneyValuation.toLocaleString()}</p>
          <p className="text-xs text-purple-400 font-bold">
            Investor Equity Dilution: ~{investorDilution}%
          </p>
        </div>
      </div>

      {/* Grid: Interactive Cap Table + Dynamic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shareholders List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <FiUsers className="text-indigo-400" /> Ownership Equity Breakdown
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                totalAllocated === 100
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              Total Allocated: {totalAllocated}%
            </span>
          </div>

          <div className="space-y-3">
            {shareholders.map((s, index) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm">{s.name}</h4>
                    <p className="text-xs text-slate-400">
                      Estimated Value: ${( (s.sharesPercent / 100) * postMoneyValuation ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-black text-white text-sm">{s.sharesPercent}%</span>
                  <button
                    onClick={() => handleRemoveMember(s.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                    title="Remove Shareholder"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Shareholder Form */}
          <form onSubmit={handleAddMember} className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Stakeholder Name (e.g. Lead Engineer)"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="input-field text-xs flex-1 min-w-[180px]"
            />
            <input
              type="number"
              placeholder="Equity %"
              value={newMemberPercent}
              onChange={(e) => setNewMemberPercent(e.target.value)}
              className="input-field text-xs w-28"
            />
            <button type="submit" className="btn-primary px-4 py-3 text-xs font-bold">
              <FiPlus /> Add
            </button>
          </form>
        </div>

        {/* Right: Interactive Pie Chart */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col items-center justify-center">
          <h3 className="font-extrabold text-white text-base mb-4 self-start">
            Equity Distribution Chart
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    background: '#07090F',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
