
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

interface FileInfo {
  name: string;
  base64: string;
  mimeType: string;
}

interface CVInputFormProps {
  onProcess: (
    cvContent: string | FileInfo, 
    jdContent: string | FileInfo, 
    photoContent: FileInfo | null,
    additionalInfo: string
  ) => void;
}

const getMimeType = (file: File): string => {
  if (file.type && file.type !== '') return file.type;
  const extension = file.name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    default: return 'application/octet-stream';
  }
};

const CVInputForm: React.FC<CVInputFormProps> = ({ onProcess }) => {
  const [cvFile, setCvFile] = useState<FileInfo | null>(null);
  const [cvText, setCvText] = useState('');
  const [jdFile, setJdFile] = useState<FileInfo | null>(null);
  const [jdText, setJdText] = useState('');
  const [photoFile, setPhotoFile] = useState<FileInfo | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [isDraggingCv, setIsDraggingCv] = useState(false);
  const [isDraggingJd, setIsDraggingJd] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  
  const cvInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File, type: 'cv' | 'jd' | 'photo') => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const mimeType = getMimeType(file);
      
      if (type === 'cv') setCvFile({ name: file.name, base64, mimeType });
      else if (type === 'jd') setJdFile({ name: file.name, base64, mimeType });
      else if (type === 'photo') setPhotoFile({ name: file.name, base64, mimeType });
    };
    reader.onerror = () => {
      console.error("Lỗi khi đọc file");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDragOver = (e: React.DragEvent, section: 'cv' | 'jd' | 'photo') => {
    e.preventDefault();
    if (section === 'cv') setIsDraggingCv(true);
    if (section === 'jd') setIsDraggingJd(true);
    if (section === 'photo') setIsDraggingPhoto(true);
  };

  const handleDragLeave = (section: 'cv' | 'jd' | 'photo') => {
    if (section === 'cv') setIsDraggingCv(false);
    if (section === 'jd') setIsDraggingJd(false);
    if (section === 'photo') setIsDraggingPhoto(false);
  };

  const handleDrop = (e: React.DragEvent, section: 'cv' | 'jd' | 'photo') => {
    e.preventDefault();
    handleDragLeave(section);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, section);
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file, 'photo');
            const toast = document.createElement('div');
            toast.innerText = "Đã dán ảnh chân dung!";
            toast.className = "fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#F26522] text-white px-6 py-3 rounded-full font-bold shadow-xl animate-bounce z-50";
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  // Validation logic - reactive to all state pieces
  const hasCv = useMemo(() => !!cvFile || cvText.trim().length >= 2, [cvFile, cvText]);
  const hasJd = useMemo(() => !!jdFile || jdText.trim().length >= 2, [jdFile, jdText]);
  const hasPhoto = useMemo(() => !!photoFile, [photoFile]);
  const isFormValid = hasCv && hasJd && hasPhoto;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onProcess(cvFile || cvText, jdFile || jdText, photoFile, additionalInfo);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CV SECTION */}
        <div 
          className="flex flex-col space-y-3"
          onDragOver={(e) => handleDragOver(e, 'cv')}
          onDragLeave={() => handleDragLeave('cv')}
          onDrop={(e) => handleDrop(e, 'cv')}
        >
          <div className="flex justify-between items-center">
            <label className="text-sm font-black uppercase tracking-tight text-slate-700">
              CV Ứng viên {hasCv ? <span className="text-green-500 ml-1">✅</span> : <span className="text-slate-400 ml-1">(Bắt buộc)</span>}
            </label>
            <button type="button" onClick={() => cvInputRef.current?.click()} className="text-[10px] font-black text-[#F26522] uppercase tracking-widest border border-[#F26522]/20 px-3 py-1 rounded-full hover:bg-[#F26522] hover:text-white transition-all">Tải file</button>
          </div>
          <div className={`relative transition-all duration-200 ${isDraggingCv ? 'scale-[1.02]' : ''}`}>
            {cvFile ? (
               <div className="h-[250px] border-2 border-[#F26522] bg-[#F26522]/5 rounded-2xl flex flex-col items-center justify-center p-6 shadow-inner">
                  <div className="w-12 h-12 bg-[#F26522] text-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="font-bold text-slate-800 truncate max-w-full mb-1">{cvFile.name}</p>
                  <button type="button" onClick={() => setCvFile(null)} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Hủy và dán text</button>
               </div>
            ) : (
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Dán nội dung CV hoặc kéo thả file vào đây..."
                className={`h-[250px] w-full p-5 text-sm bg-white border-2 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#F26522] focus:border-transparent resize-none transition-all ${isDraggingCv ? 'border-[#F26522] bg-[#F26522]/5' : 'border-slate-200'}`}
              />
            )}
            <input type="file" ref={cvInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f, 'cv'); }} className="hidden" />
          </div>
        </div>

        {/* JD SECTION */}
        <div 
          className="flex flex-col space-y-3"
          onDragOver={(e) => handleDragOver(e, 'jd')}
          onDragLeave={() => handleDragLeave('jd')}
          onDrop={(e) => handleDrop(e, 'jd')}
        >
          <div className="flex justify-between items-center">
            <label className="text-sm font-black uppercase tracking-tight text-slate-700">
              Mô tả công việc {hasJd ? <span className="text-green-500 ml-1">✅</span> : <span className="text-slate-400 ml-1">(Bắt buộc)</span>}
            </label>
            <button type="button" onClick={() => jdInputRef.current?.click()} className="text-[10px] font-black text-[#F26522] uppercase tracking-widest border border-[#F26522]/20 px-3 py-1 rounded-full hover:bg-[#F26522] hover:text-white transition-all">Tải file</button>
          </div>
          <div className={`relative transition-all duration-200 ${isDraggingJd ? 'scale-[1.02]' : ''}`}>
            {jdFile ? (
               <div className="h-[250px] border-2 border-[#F26522] bg-[#F26522]/5 rounded-2xl flex flex-col items-center justify-center p-6 shadow-inner">
                  <div className="w-12 h-12 bg-[#F26522] text-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="font-bold text-slate-800 truncate max-w-full mb-1">{jdFile.name}</p>
                  <button type="button" onClick={() => setJdFile(null)} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Hủy và dán text</button>
               </div>
            ) : (
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Dán nội dung JD hoặc kéo thả file vào đây..."
                className={`h-[250px] w-full p-5 text-sm bg-white border-2 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#F26522] focus:border-transparent resize-none transition-all ${isDraggingJd ? 'border-[#F26522] bg-[#F26522]/5' : 'border-slate-200'}`}
              />
            )}
            <input type="file" ref={jdInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f, 'jd'); }} className="hidden" />
          </div>
        </div>

        {/* ADDITIONAL INFO SECTION (NEW) */}
        <div className="lg:col-span-2">
           <label className="text-sm font-black uppercase tracking-tight text-slate-700 flex justify-between items-center mb-3">
              <span>Thông tin bổ sung <span className="text-slate-400 font-medium normal-case tracking-normal ml-1">(Tùy chọn)</span></span>
              <span className="text-[10px] text-[#F26522] font-bold bg-[#F26522]/10 px-2 py-0.5 rounded">Dùng khi CV gốc thiếu thông tin</span>
           </label>
           <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Nhập thêm thông tin không có trong CV (Ví dụ: Kinh nghiệm dạy online, chứng chỉ TESOL mới lấy, kỹ năng quản lý lớp học đặc biệt...)"
              className="w-full h-[100px] p-5 text-sm bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#F26522] focus:border-transparent resize-none transition-all"
           />
        </div>

        {/* PHOTO SECTION */}
        <div 
          className="lg:col-span-2"
          onDragOver={(e) => handleDragOver(e, 'photo')}
          onDragLeave={() => handleDragLeave('photo')}
          onDrop={(e) => handleDrop(e, 'photo')}
        >
          <div 
            onClick={() => photoInputRef.current?.click()}
            className={`group relative h-40 w-full border-2 border-dashed rounded-3xl flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:border-[#F26522] ${photoFile ? 'border-[#F26522] bg-[#F26522]/5 shadow-inner' : (isDraggingPhoto ? 'border-[#F26522] bg-[#F26522]/10 ring-4 ring-[#F26522]/10' : 'border-slate-300 bg-slate-50')}`}
          >
            {photoFile ? (
              <div className="flex items-center space-x-6 px-8 w-full">
                <img src={`data:${photoFile.mimeType};base64,${photoFile.base64}`} alt="Preview" className="h-28 w-24 object-cover rounded-xl shadow-lg border-2 border-white" />
                <div className="flex-1 overflow-hidden text-left">
                  <p className="font-black text-slate-800 uppercase tracking-tight text-lg">Đã sẵn sàng chân dung ứng viên ✅</p>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">{photoFile.name}</p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPhotoFile(null); }}
                  className="p-3 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${isDraggingPhoto ? 'bg-[#F26522] text-white animate-bounce' : 'bg-slate-200 text-slate-400 group-hover:bg-[#F26522]/10 group-hover:text-[#F26522]'}`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className={`font-black uppercase tracking-tight text-xl transition-colors ${isDraggingPhoto ? 'text-[#F26522]' : 'text-slate-600 group-hover:text-[#F26522]'}`}>
                  {isDraggingPhoto ? 'Thả file ảnh vào đây' : 'Bắt buộc: Dán chân dung (CTRL+V) hoặc Nhấn để tải lên'}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 bg-slate-100 px-4 py-1 rounded-full inline-block">Hỗ trợ PDF, JPG, PNG & Kéo thả trực tiếp</p>
              </div>
            )}
            <input type="file" ref={photoInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) processFile(f, 'photo'); }} accept="image/*" className="hidden" />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-24 py-6 text-white rounded-full font-black text-2xl shadow-[0_20px_50px_-10px_rgba(242,101,34,0.5)] transition-all flex items-center space-x-6 uppercase tracking-tighter ${
            isFormValid 
              ? 'bg-[#F26522] hover:scale-105 active:scale-95 cursor-pointer opacity-100 grayscale-0' 
              : 'bg-slate-400 opacity-50 grayscale cursor-not-allowed'
          }`}
        >
          <span>Bắt đầu sửa CV</span>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </form>
  );
};

export default CVInputForm;
