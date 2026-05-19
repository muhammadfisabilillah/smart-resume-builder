'use client';

import { useState } from 'react';

interface OptimizedResponse {
  original_text: string;
  suggested_text: string;
  reason: string;
}

export default function ResumeBuilder() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<OptimizedResponse | null>(null);
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);

  const handleOptimize = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      
      if (!response.ok) throw new Error('Network response error');
      
      const data: OptimizedResponse = await response.json();
      setAiResult(data);
    } catch (error) {
      console.error('API Error:', error);
      alert('Failed to optimize content. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    if (aiResult) {
      setBulletPoints([...bulletPoints, aiResult.suggested_text]);
      setInputText('');
      setAiResult(null);
    }
  };

  return (
    <main className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      
      {/* LEFT PANEL: EDITOR & AI INSIGHTS */}
      <section className="w-1/2 p-8 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Resume Content Optimizer
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Optimize your professional experience descriptions using ATS-compliant metrics.
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Work Description Input
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., saya dulu pernah jaga toko dan ngurusin barang masuk tiap hari biar ga berantakan"
              className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none resize-none transition-all"
            />
            <button
              onClick={handleOptimize}
              disabled={loading || !inputText.trim()}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-medium py-2.5 rounded-lg transition-all"
            >
              {loading ? 'Optimizing Profile...' : 'Analyze & Optimize Content'}
            </button>
          </div>

          {/* AI Feedback Panel (Hanya muncul jika ada hasil dari API) */}
          {aiResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 animate-fade-in">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                  AI Optimization Insight
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-500">Suggested Output:</h4>
                <p className="text-sm text-slate-800 bg-white p-3 border border-slate-100 rounded shadow-sm">
                  {aiResult.suggested_text}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-500">Justification:</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {aiResult.reason}
                </p>
              </div>
              <button
                onClick={applySuggestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-all"
              >
                Apply to Resume Preview
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-4">
          Enterprise Resume Builder Engine v1.0
        </div>
      </section>

      {/* RIGHT PANEL: STANDARD ATS RESUME PREVIEW */}
      <section className="w-1/2 p-8 bg-slate-100 overflow-y-auto flex justify-center items-start">
        <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-md p-12 flex flex-col gap-6 text-black font-serif">
          
          {/* Resume Header */}
          <div className="border-b border-black pb-3 text-center space-y-1">
            <h2 className="text-xl font-bold tracking-wide uppercase">JOHN DOE</h2>
            <p className="text-xs font-sans text-gray-600">
              Surabaya, Indonesia | +62 812 3456 7890 | professional@email.com | linkedin.com/in/johndoe
            </p>
          </div>

          {/* Professional Experience Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider uppercase border-b border-black pb-0.5 font-sans">
              Professional Experience
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-baseline font-sans text-xs font-bold">
                <h4>Operations Associate</h4>
                <span className="text-gray-600 font-normal">May 2025 – Present</span>
              </div>
              <div className="flex justify-between items-baseline font-sans text-[11px] text-gray-500 italic">
                <span>Retail & Distribution Company</span>
                <span>Surabaya, Indonesia</span>
              </div>

              {/* Dynamic Bullet Points */}
              <ul className="list-disc pl-5 text-xs space-y-1.5 leading-relaxed font-serif">
                {bulletPoints.length === 0 ? (
                  <li className="text-gray-400 italic font-sans list-none pl-0">
                    No descriptions added yet. Use the optimization panel to populate this section.
                  </li>
                ) : (
                  bulletPoints.map((point, index) => (
                    <li key={index} className="text-justify">{point}</li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Education Section (Standard Template Placeholder) */}
          <div className="space-y-2 mt-2">
            <h3 className="text-xs font-bold tracking-wider uppercase border-b border-black pb-0.5 font-sans">
              Education
            </h3>
            <div className="flex justify-between items-baseline font-sans text-xs font-bold">
              <h4>Management Information Systems</h4>
              <span className="text-gray-600 font-normal">Graduation 2027</span>
            </div>
            <div className="flex justify-between items-baseline font-sans text-[11px] text-gray-500">
              <span>State University of Indonesia</span>
              <span>GPA: 3.85 / 4.00</span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}