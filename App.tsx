
import React, { useState, useCallback } from 'react';
import { optimizeCV, processHeadshot, FileData } from './services/geminiService';
import { AppStatus, CVAnalysisResult } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CVInputForm from './components/CVInputForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingOverlay from './components/LoadingOverlay';

interface FileInfo {
  name: string;
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<CVAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async (
    cvInput: string | FileInfo,
    jdInput: string | FileInfo,
    photoInput: FileInfo | null
  ) => {
    if (!photoInput) {
      setError("Bạn bắt buộc phải tải lên hoặc dán ảnh chân dung của ứng viên.");
      return;
    }

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      // 1. Xử lý ảnh chân dung trước
      const photoData: FileData = { 
        inlineData: { data: photoInput.base64, mimeType: photoInput.mimeType } 
      };
      const processedPhotoBase64 = await processHeadshot(photoData);

      // 2. Chuẩn bị dữ liệu CV và JD
      const cvData = typeof cvInput === 'string' 
        ? cvInput 
        : { inlineData: { data: cvInput.base64, mimeType: cvInput.mimeType } } as FileData;
      
      const jdData = typeof jdInput === 'string' 
        ? jdInput 
        : { inlineData: { data: jdInput.base64, mimeType: jdInput.mimeType } } as FileData;

      // 3. Tối ưu hóa CV
      const analysisResult = await optimizeCV(cvData, jdData);
      
      const finalPhotoUrl = `data:image/png;base64,${processedPhotoBase64}`;

      setResult({
        ...analysisResult,
        photoUrl: finalPhotoUrl
      });
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      let errorMsg = "Hệ thống không thể xử lý dữ liệu này. Hãy thử dán văn bản trực tiếp.";
      
      if (err.message === "API_KEY_MISSING") {
        errorMsg = "Lỗi cấu hình: Thiếu API_KEY trên Vercel. Hãy kiểm tra Environment Variables trong Project Settings.";
      } else if (err.message?.includes('timeout')) {
        errorMsg = "Lỗi: Thời gian xử lý quá lâu (Timeout). Hãy thử dán văn bản ngắn gọn hơn.";
      } else if (err.message?.includes('fetch')) {
        errorMsg = "Lỗi kết nối: Không thể gọi đến API Gemini. Kiểm tra lại mạng hoặc API Key.";
      }
      
      setError(errorMsg);
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
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-sm animate-in fade-in duration-300">
            <h3 className="font-black uppercase tracking-tight mb-1 text-red-800">Thông báo lỗi</h3>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {status === AppStatus.IDLE || status === AppStatus.ERROR ? (
          <div className="space-y-12">
            <section className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-1.5 bg-[#F26522]/10 text-[#F26522] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-[#F26522]/20">
                EIV AI CV Tailor
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl mb-6 uppercase italic">
                SỬA CV <span className="text-[#F26522] not-italic">SIÊU TỐC</span>
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Dán text, thả file, và <span className="text-[#F26522]">BẮT BUỘC up/dán ảnh chân dung</span>. 
                Hệ thống sẽ tự động tối ưu hóa nội dung giáo viên theo JD.
              </p>
            </section>
            <CVInputForm onProcess={handleProcess} />
          </div>
        ) : status === AppStatus.COMPLETED && result ? (
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 print:hidden">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">XỬ LÝ HOÀN TẤT</h2>
              <button onClick={handleReset} className="px-8 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:border-[#F26522] transition-all">Sửa ứng viên mới</button>
            </div>
            <ResultDisplay result={result} />
          </div>
        ) : null}
      </main>

      {status === AppStatus.PROCESSING && <LoadingOverlay />}
      <Footer />
    </div>
  );
};

export default App;
