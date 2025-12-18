import React, { useState, useRef, memo } from 'react';

interface FileInfo {
  name: string;
  base64: string;
  mimeType: string;
}

interface FileUploadZoneProps {
  label: string;
  file: FileInfo | null;
  text: string;
  type: 'cv' | 'jd' | 'photo';
  onTextChange: (val: string) => void;
  onFileClick: () => void;
  onClear: () => void;
  onProcessFile: (file: File, type: 'cv' | 'jd' | 'photo') => void;
  placeholder: string;
}

// Sử dụng memo để tránh re-render không cần thiết và đảm bảo focus ổn định
const FileUploadZone: React.FC<FileUploadZoneProps> = memo(({ 
  label, 
  file, 
  text, 
  type,
  onTextChange, 
  onFileClick, 
  onClear,
  onProcessFile,
  placeholder 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">
          {label}
        </label>
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">PDF/Ảnh</span>
          {file && (
            <button 
              type="button" 
              onClick={onClear}
              className="text-[10px] text-red-500 font-bold hover:underline"
            >
              Xóa file để dán text
            </button>
          )}
        </div>
      </div>
      
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) onProcessFile(droppedFile, type);
        }}
        className={`relative transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}
      >
        {!file ? (
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={placeholder}
              className={`h-[300px] w-full p-4 text-sm bg-white border-2 rounded-xl shadow-sm focus:ring-2 focus:ring-[#F26522] focus:border-transparent resize-none transition-all pr-12 ${isDragging ? 'border-[#F26522] bg-[#F26522]/5' : 'border-slate-200'}`}
            />
            <button
              type="button"
              onClick={onFileClick}
              className="absolute right-3 top-3 p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#F26522] hover:text-white transition-all shadow-sm group-hover:scale-110"
              title="Tải lên file (Chỉ PDF hoặc Ảnh)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-[#F26522] text-white px-6 py-3 rounded-full font-black text-sm shadow-xl flex items-center space-x-2">
                  <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>THẢ PDF/ẢNH</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={`h-[300px] w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition-colors ${isDragging ? 'border-[#F26522] bg-[#F26522]/10' : 'border-[#F26522] bg-[#F26522]/5'}`}>
            <div className="w-16 h-16 bg-[#F26522] text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="font-bold text-slate-800 text-lg mb-1 truncate max-w-full px-4">{file.name}</p>
            <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Sẵn sàng tối ưu</p>
            <button 
              type="button"
              onClick={onFileClick}
              className="mt-6 text-xs font-bold text-[#F26522] hover:underline"
            >
              Thay đổi file khác
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

interface CVInputFormProps {
  onProcess: (
    cvContent: string | FileInfo, 
    jdContent: string | FileInfo, 
    photoBase64: string | null
  ) => void;
}

const CVInputForm: React.FC<CVInputFormProps> = ({ onProcess }) => {
  const [cvFile, setCvFile] = useState<FileInfo | null>(null);
  const [cvText, setCvText] = useState('');
  const [jdFile, setJdFile] = useState<FileInfo | null>(null);
  const [jdText, setJdText] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

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

  const processFile = (file: File, type: 'cv' | 'jd' | 'photo') => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'doc' || extension === 'docx') {
      alert("Hệ thống chỉ nhận file PDF hoặc Ảnh trực tiếp. Với file Word (.doc, .docx), vui lòng COPY nội dung văn bản và DÁN vào ô nhập liệu bên dưới.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const mimeType = getMimeType(file);
      
      if (type === 'photo') {
        setPhoto(result);
      } else if (type === 'cv') {
        setCvFile({ name: file.name, base64, mimeType });
      } else if (type === 'jd') {
        setJdFile({ name: file.name, base64, mimeType });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'jd' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) processFile(file, type);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cvPayload = cvFile || cvText;
    const jdPayload = jdFile || jdText;
    onProcess(cvPayload, jdPayload, photo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
      {/* Upload Photo Section */}
      <div className="max-w-md mx-auto">
        <div 
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingPhoto(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingPhoto(false); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingPhoto(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file, 'photo');
          }}
          className={`bg-white p-6 rounded-3xl border shadow-sm flex items-center gap-6 relative overflow-hidden group transition-all duration-300 ${isDraggingPhoto ? 'border-[#F26522] ring-4 ring-[#F26522]/10 scale-105' : 'border-slate-200'}`}
        >
          <div 
            onClick={() => photoInputRef.current?.click()}
            className={`w-24 h-32 bg-slate-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative z-10 shrink-0 ${isDraggingPhoto ? 'border-[#F26522] bg-[#F26522]/5' : 'border-slate-200'}`}
          >
            {photo ? (
              <img src={photo} alt="Teacher Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-2">
                <svg className={`w-8 h-8 mx-auto mb-1 transition-colors ${isDraggingPhoto ? 'text-[#F26522]' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`text-[8px] font-black uppercase leading-none block transition-colors ${isDraggingPhoto ? 'text-[#F26522]' : 'text-slate-400'}`}>
                  {isDraggingPhoto ? 'THẢ ẢNH' : 'ẢNH GIÁO VIÊN'}
                </span>
              </div>
            )}
            <input type="file" ref={photoInputRef} onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" className="hidden" />
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-black uppercase tracking-tight mb-1 transition-colors ${isDraggingPhoto ? 'text-[#F26522]' : 'text-slate-800'}`}>
              {isDraggingPhoto ? 'Thả ảnh vào đây' : 'Ảnh chân dung'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Kéo thả ảnh hoặc nhấn để tải lên.</p>
          </div>
        </div>
      </div>

      {/* Main Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FileUploadZone 
          label="Hồ sơ ứng viên (CV)"
          file={cvFile}
          text={cvText}
          type="cv"
          onTextChange={setCvText}
          onFileClick={() => cvInputRef.current?.click()}
          onClear={() => { setCvFile(null); setCvText(''); }}
          onProcessFile={processFile}
          placeholder="Dán nội dung từ file Word HOẶC kéo thả file PDF/Ảnh vào đây..."
        />
        <input type="file" ref={cvInputRef} onChange={(e) => handleFileChange(e, 'cv')} accept=".pdf,image/*" className="hidden" />

        <FileUploadZone 
          label="Mô tả công việc (JD)"
          file={jdFile}
          text={jdText}
          type="jd"
          onTextChange={setJdText}
          onFileClick={() => jdInputRef.current?.click()}
          onClear={() => { setJdFile(null); setJdText(''); }}
          onProcessFile={processFile}
          placeholder="Dán nội dung JD hoặc kéo thả file PDF/Ảnh vào đây..."
        />
        <input type="file" ref={jdInputRef} onChange={(e) => handleFileChange(e, 'jd')} accept=".pdf,image/*" className="hidden" />
      </div>

      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={(!cvFile && !cvText) || (!jdFile && !jdText)}
          className="px-16 py-5 bg-[#F26522] text-white rounded-full font-black text-2xl shadow-[0_15px_40px_-10px_rgba(242,101,34,0.5)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center space-x-4 uppercase tracking-tighter"
        >
          <span>TIẾN HÀNH TỐI ƯU</span>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default CVInputForm;