
import React, { useState, useEffect } from 'react';

const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Đang phân tích kỹ năng của bạn...",
    "Đang so khớp với yêu cầu nhà tuyển dụng...",
    "Tìm kiếm từ khóa phù hợp (ATS)...",
    "Sắp xếp lại các thành tựu của bạn...",
    "Đang hoàn tất bản thảo tối ưu nhất..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-xs w-full text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Đang thực hiện ảo thuật...</h3>
        <p className="text-sm text-slate-500 h-10 transition-all duration-500">
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
