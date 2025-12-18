
import React, { useState, useCallback } from 'react';
import { optimizeCV, FileData } from './services/geminiService';
import { AppStatus, CVAnalysisResult } from './types';
import Header from './components/Header';
import CVInputForm from './components/CVInputForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async (
    cvInput: string | { base64: string; mimeType: string },
    jdInput: string | { base64: string; mimeType: string },
    photoBase64: string | null
  ) => {
    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const cvData = typeof cvInput === 'string' 
        ? cvInput 
        : { inlineData: { data: cvInput.base64, mimeType: cvInput.mimeType } } as FileData;
      
      const jdData = typeof jdInput === 'string' 
        ? jdInput 
        : { inlineData: { data: jdInput.base64, mimeType: jdInput.mimeType } } as FileData;

      const analysisResult = await optimizeCV(cvData, jdData);
      
      const resultWithAssets = {
        ...analysisResult,
        photoUrl: photoBase64 || undefined
      };
      setResult(resultWithAssets);
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError("Đã có lỗi xảy ra. Hãy đảm bảo file bạn tải lên không quá nặng và có nội dung rõ ràng.");
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl print:max-w-none print:p-0">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-sm animate-in slide-in-from-top-4">
            <h3 className="font-black uppercase tracking-tight mb-1">Xử lý thất bại</h3>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="space-y-12 animate-in fade-in duration-700">
            <section className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 bg-[#F26522]/10 text-[#F26522] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#F26522]/20">
                Internal Recruitment Tool
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 uppercase italic">
                SỬA CV <span className="text-[#F26522] not-italic">THEO MẪU CHUẨN</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Tải lên file CV của giáo viên và JD công việc. Hệ thống sẽ tự động trích xuất, 
                tối ưu nội dung và điền vào mẫu chuẩn của EIV trong tích tắc.
              </p>
            </section>
            <CVInputForm onProcess={handleProcess} />
          </div>
        ) : status === AppStatus.COMPLETED && result ? (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 print:hidden">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">XỬ LÝ HOÀN TẤT</h2>
                <p className="text-slate-500 font-medium italic">Vui lòng kiểm tra kỹ thông tin trước khi xuất PDF</p>
              </div>
              <button 
                onClick={handleReset}
                className="group flex items-center space-x-2 px-8 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-[#F26522] hover:text-[#F26522] transition-all"
              >
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Sửa ứng viên mới</span>
              </button>
            </div>
            <ResultDisplay result={result} />
          </div>
        ) : null}
      </main>

      {status === AppStatus.PROCESSING && <LoadingOverlay />}

      <footer className="bg-white border-t border-slate-200 py-12 text-center print:hidden">
        <div className="flex flex-col items-center justify-center space-y-4 mb-6">
           <img 
             src="https://eiv.edu.vn/wp-content/uploads/2024/04/logo-web2.png" 
             alt="EIV Logo" 
             className="h-12 w-auto object-contain"
           />
           <div className="w-16 h-px bg-slate-200"></div>
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recruitment Excellence System v2.0</p>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2009 - 2024 EIV Education Vietnam. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
