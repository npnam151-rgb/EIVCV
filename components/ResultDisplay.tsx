
import React, { useState } from 'react';
import { CVAnalysisResult } from '../types';
import EIVTemplate from './EIVTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultDisplayProps {
  result: CVAnalysisResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'template' | 'markdown'>('template');
  const [isExporting, setIsExporting] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 50) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const handleExportPDF = async () => {
    const container = document.getElementById('cv-pages-container');
    if (!container) return;

    setIsExporting(true);
    try {
      // Create a new jsPDF instance (A4 size)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = container.querySelectorAll('.a4-page');

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 3, // High quality
          useCORS: true,
          logging: false,
          allowTaint: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      // Automatically download the file
      const fileName = `EIV_CV_${result.sidebarInfo.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar - Hide on print */}
      <div className="space-y-6 lg:col-span-1 print:hidden">
        <div className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center ${getScoreColor(result.matchScore)} shadow-sm`}>
          <span className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Điểm Ưu Tiên EIV</span>
          <span className="text-6xl font-black">{result.matchScore}%</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col gap-4">
             <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="w-full flex items-center justify-center space-x-2 bg-[#F26522] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-[#d44d18] transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ĐANG TẠO FILE...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>TẢI PDF VỀ MÁY</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center font-medium uppercase tracking-tighter italic">Hỗ trợ tự động chia trang và chuẩn A4</p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Thế mạnh</h4>
            <div className="flex flex-wrap gap-1">
              {result.strengths.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
          <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center text-[#F26522]">
            LOG THAY ĐỔI
          </h4>
          <ul className="space-y-3 text-[10px] leading-relaxed text-slate-400 font-medium">
            {result.keyChanges.map((change, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 text-[#F26522]">•</span>
                {change}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-3">
        <div className="bg-slate-200/50 rounded-3xl p-4 md:p-8 border border-slate-200 overflow-x-auto min-h-[1200px] flex flex-col items-center">
          <div className="flex space-x-2 mb-8 print:hidden">
            <button 
              onClick={() => setViewMode('template')}
              className={`px-8 py-3 text-xs font-black rounded-full transition-all tracking-widest uppercase ${viewMode === 'template' ? 'bg-[#F26522] text-white shadow-xl scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              Xem mẫu CV EIV (A4)
            </button>
            <button 
              onClick={() => setViewMode('markdown')}
              className={`px-8 py-3 text-xs font-black rounded-full transition-all tracking-widest uppercase ${viewMode === 'markdown' ? 'bg-[#F26522] text-white shadow-xl scale-105' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
            >
              Xem nội dung thô
            </button>
          </div>

          {viewMode === 'template' ? (
            <EIVTemplate result={result} />
          ) : (
            <div className="bg-white w-full max-w-[800px] p-12 shadow-xl rounded-xl font-mono text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
              {result.optimizedCV}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
