import React, { useState } from 'react';
import { Sparkles, X, Send, ArrowRight } from 'lucide-react';
import { sendAiQuery } from '../services/api';

export default function AiAssistantModal({ isOpen, onClose, onApplyFilters }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const quickPrompts = [
    "Show fatal accidents on Western Express Highway",
    "High-risk hotspots with two-wheeler accidents",
    "Major accidents during rain in Bandra or Dadar",
    "Commercial truck collisions with casualties"
  ];

  const handleQuery = async (queryText) => {
    const q = queryText || prompt;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await sendAiQuery(q);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result && result.filters && onApplyFilters) {
      onApplyFilters(result.filters);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-[#D9E0E7] rounded-lg w-full max-w-xl shadow-xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-4 border-b border-[#D9E0E7] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-md bg-[#E8F1FA] text-[#0B5CAD]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1F2937] text-sm sm:text-base">
                Analysis Assistant
              </h3>
              <p className="text-[11px] text-[#5B6573]">
                Translates plain inquiries into factual database queries
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md hover:bg-[#EDF2F7] text-[#5B6573] hover:text-[#1F2937]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Query Input */}
        <div className="p-5 space-y-4 text-xs text-[#1F2937]">
          <div>
            <label className="font-semibold block mb-1 text-[#1F2937]">
              Enter Query
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder="e.g. Which corridors recorded high fatalities with heavy vehicles?"
                className="flex-1 bg-[#F5F7FA] border border-[#D9E0E7] rounded-md px-3 py-2 text-xs text-[#1F2937] focus:outline-none focus:border-[#0B5CAD]"
              />
              <button
                onClick={() => handleQuery()}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 rounded-md bg-[#0B5CAD] hover:bg-[#084887] disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center space-x-1 cursor-pointer shadow-xs"
              >
                {loading ? <span>Searching...</span> : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-[11px] text-[#5B6573] block mb-1.5 font-medium">Suggested queries:</span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(qp);
                    handleQuery(qp);
                  }}
                  className="text-[11px] bg-[#F5F7FA] hover:bg-[#E8F1FA] text-[#0B5CAD] border border-[#D9E0E7] px-2.5 py-1 rounded transition-colors text-left"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Results Output */}
          {result && (
            <div className="p-4 bg-[#F8FAFC] border border-[#D9E0E7] rounded-md space-y-2 mt-3 animate-in fade-in">
              <div className="font-bold text-xs text-[#1F2937] border-b border-[#EDF2F7] pb-1">
                Analytical Query Result
              </div>
              <p className="text-xs text-[#1F2937] leading-relaxed">
                {result.answer}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#5B6573] pt-2 border-t border-[#EDF2F7]">
                <span>Matched records: <strong>{result.matchedCount || 2692}</strong></span>
                {result.filters && Object.keys(result.filters).length > 0 && (
                  <button
                    onClick={handleApply}
                    className="text-[#0B5CAD] font-bold hover:underline flex items-center space-x-1"
                  >
                    <span>Apply these filters to dashboard</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#D9E0E7] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md border border-[#D9E0E7] text-xs font-semibold text-[#5B6573] hover:bg-[#EDF2F7]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
