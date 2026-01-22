
import React, { useState, useEffect } from 'react';
import { CVAnalysisResult } from '../types';
import EIVTemplate from './EIVTemplate';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultDisplayProps {
  result: CVAnalysisResult;
  onRefine?: (instruction: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRefine }) => {
  const [viewMode, setViewMode] = useState<'template' | 'markdown'>('template');
  const [isEditable, setIsEditable] = useState(true);
  const [localResult, setLocalResult] = useState<CVAnalysisResult>(result);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  
  // Refine state
  const [refineText, setRefineText] = useState('');
  const [isRefineExpanded, setIsRefineExpanded] = useState(false);

  useEffect(() => {
    setLocalResult(result);
  }, [result]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (score >= 50) return 'text-amber-600 border-amber-200 bg-amber-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const handleUpdate = (updatedResult: CVAnalysisResult) => {
    setLocalResult(updatedResult);
  };

  const handleSubmitRefine = () => {
    if (onRefine && refineText.trim()) {
      onRefine(refineText);
      setRefineText('');
      setIsRefineExpanded(false);
    }
  };

  const handleExportPDF = async () => {
    const container = document.getElementById('cv-pages-container');
    if (!container) return;

    setIsExportingPDF(true);
    setIsEditable(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = container.querySelectorAll('.a4-page');

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      const fileName = `EIV_CV_${localResult.sidebarInfo.name.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF. Vui lòng kiểm tra kết nối mạng và thử lại.');
    } finally {
      setIsExportingPDF(false);
      setIsEditable(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar điều khiển */}
      <div className="space-y-6 lg:col-span-1 print:hidden">
        <div className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center relative ${getScoreColor(localResult.matchScore)} shadow-sm`}>
          <button 
            onClick={() => setShowScoreInfo(!showScoreInfo)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
            title="Điểm ưu tiên EIV là gì?"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <span className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">Điểm Ưu Tiên EIV</span>
          <span className="text-6xl font-black">{localResult.matchScore}%</span>
        </div>

        {/* Phần giải thích Điểm Ưu Tiên EIV */}
        {showScoreInfo && (
          <div className="bg-[#F26522] text-white p-5 rounded-2xl shadow-xl animate-in zoom-in-95 duration-200">
            <h4 className="font-black text-sm uppercase tracking-tight mb-3 flex justify-between items-center">
              <span>Điểm ưu tiên EIV là gì?</span>
              <button onClick={() => setShowScoreInfo(false)} className="text-white/60 hover:text-white">✕</button>
            </h4>
            <div className="space-y-3 text-[11px] leading-relaxed">
              <p>Là chỉ số thông minh được AI phân tích dựa trên sự so khớp giữa CV và JD:</p>
              <ul className="space-y-2 list-none font-medium">
                <li className="flex gap-2">
                  <span className="opacity-50">01.</span>
                  <span><strong>Mức độ phù hợp:</strong> Đánh giá kỹ năng, bằng cấp (TESOL, CELTA) và kinh nghiệm giảng dạy.</span>
                </li>
                <li className="flex gap-2">
                  <span className="opacity-50">02.</span>
                  <span><strong>Tiêu chuẩn EIV:</strong> Đánh giá theo tiêu chí tuyển dụng ESL chuyên biệt và quản lý lớp học.</span>
                </li>
                <li className="flex gap-2">
                  <span className="opacity-50">03.</span>
                  <span><strong>Tối ưu từ khóa:</strong> Kiểm tra các từ khóa quan trọng cho hệ thống ATS.</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-white/20 mt-2 italic opacity-90">
                <p>● 80-100%: Cực kỳ tiềm năng.</p>
                <p>● 50-79%: Cần chỉnh sửa thêm.</p>
                <p>● &lt;50%: Ít tương quan.</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL REFINE CV (NEW) */}
        {onRefine && (
          <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-sm transition-all">
            <div 
              className="flex justify-between items-center cursor-pointer mb-2"
              onClick={() => setIsRefineExpanded(!isRefineExpanded)}
            >
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-indigo-100 p-1 rounded text-indigo-600">✨</span>
                AI Refinement
              </h4>
              <span className="text-indigo-400 text-xs font-bold">{isRefineExpanded ? '−' : '+'}</span>
            </div>
            
            <div className={`overflow-hidden transition-all duration-300 ${isRefineExpanded ? 'max-h-[300px] opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
              <textarea
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Ví dụ: Thêm kinh nghiệm làm tại VUS từ 2019-2020, đổi quốc tịch thành Anh, xóa kỹ năng Python..."
                className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50 min-h-[100px] mb-3"
              />
              <button
                onClick={handleSubmitRefine}
                disabled={!refineText.trim()}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cập nhật CV
              </button>
            </div>
             {!isRefineExpanded && (
               <p className="text-[10px] text-slate-400 mt-1 pl-8">Nhấn để thêm thông tin hoặc chỉnh sửa lại bằng AI.</p>
             )}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col gap-3">
             <button 
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="w-full flex items-center justify-center space-x-2 bg-[#F26522] text-white py-4 rounded-xl font-black text-lg shadow-lg hover:bg-[#d44d18] transition-all disabled:opacity-50 disabled:cursor-wait"
            >
              {isExportingPDF ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ĐANG TẠO PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>XUẤT FILE PDF</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Thế mạnh trích xuất</h4>
            <div className="flex flex-wrap gap-1">
              {localResult.strengths.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                  {s}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-[10px] text-amber-700 font-bold leading-tight">
              💡 Bạn có thể nhấn trực tiếp vào nội dung CV bên phải để chỉnh sửa nhanh. Mọi thay đổi sẽ được tự động áp dụng khi xuất PDF.
            </p>
          </div>
        </div>
      </div>

      {/* Vùng xem trước CV */}
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
            <EIVTemplate 
              result={localResult} 
              isEditable={isEditable} 
              onUpdate={handleUpdate}
            />
          ) : (
            <div className="bg-white w-full max-w-[800px] p-12 shadow-xl rounded-xl font-mono text-sm whitespace-pre-wrap leading-relaxed text-slate-700">
              {localResult.optimizedCV}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
