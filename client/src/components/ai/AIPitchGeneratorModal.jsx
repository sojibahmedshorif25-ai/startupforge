import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiDownload, FiX, FiCheckCircle, FiFileText } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export default function AIPitchGeneratorModal({ isOpen, onClose, startupName = 'TechVision AI', industry = 'AI & Machine Learning' }) {
  const [generating, setGenerating] = useState(false);
  const [documentType, setDocumentType] = useState('pitch'); // 'pitch' | 'equity'
  const [pitchData, setPitchData] = useState({
    title: `${startupName} - Investor Pitch Deck & Strategy`,
    problem: 'Traditional startup hiring lacks AI automated candidate matching and real-time equity verification.',
    solution: `StartupForge powered AI infrastructure for ${startupName} enabling rapid team assembly and milestone escrow.`,
    marketSize: '$120 Billion Global Startup Ecosystem Market (24% CAGR)',
    businessModel: 'B2B SaaS Subscriptions ($19.99/mo) + 2.5% Milestone Escrow Transaction Fee',
    equityTerms: 'Founders 60% | Early Collaborators 20% | Option Pool 20% (4-Year Vesting with 1-Year Cliff)',
  });

  const handleGenerateAI = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success('✨ AI Pitch Deck & Agreement synthesized successfully!');
    }, 1200);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ai-document-preview');
    if (!element) return;
    try {
      toast('Generating PDF document...');
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${startupName.replace(/\s+/g, '_')}_${documentType.toUpperCase()}_Document.pdf`);
      toast.success('🎉 PDF Download Complete!');
    } catch (err) {
      toast.error('Failed to export PDF document.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg">
              <FiZap size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">AI Pitch & Equity PDF Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate investor-ready Pitch Decks & Co-founder Agreements</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl bg-slate-100 dark:bg-slate-800">
            <FiX size={18} />
          </button>
        </div>

        {/* Document Switcher */}
        <div className="flex gap-3 py-4">
          <button
            onClick={() => setDocumentType('pitch')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              documentType === 'pitch'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <FiZap size={14} /> Investor Pitch Deck
          </button>
          <button
            onClick={() => setDocumentType('equity')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              documentType === 'equity'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <FiFileText size={14} /> Equity Share Agreement
          </button>
        </div>

        {/* Printable PDF Preview Box */}
        <div
          id="ai-document-preview"
          className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 my-2 text-slate-900 dark:text-slate-100 font-sans"
        >
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
              StartupForge AI Document Generator • {industry}
            </span>
            <h2 className="text-xl font-black mt-1 text-slate-900 dark:text-white">
              {documentType === 'pitch' ? pitchData.title : `${startupName} - Co-Founder & Member Equity Agreement`}
            </h2>
          </div>

          {documentType === 'pitch' ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 uppercase tracking-wider text-[10px]">1. The Problem</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pitchData.problem}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">2. The AI Solution</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pitchData.solution}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1 uppercase tracking-wider text-[10px]">3. Target Market</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pitchData.marketSize}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1 uppercase tracking-wider text-[10px]">4. Revenue & Business Model</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pitchData.businessModel}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 uppercase tracking-wider text-[10px]">Equity Ownership Distribution</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{pitchData.equityTerms}</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 uppercase tracking-wider text-[10px]">IP & Invention Assignment</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  All software code, intellectual property, algorithms, and designs created during collaboration are automatically assigned to {startupName}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button
            onClick={handleGenerateAI}
            disabled={generating}
            className="btn-ai flex-1 py-3 text-xs font-bold"
          >
            <FiZap /> {generating ? 'Synthesizing with AI...' : 'Regenerate with AI'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-primary flex-1 py-3 text-xs font-bold"
          >
            <FiDownload /> Download PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
}
