
import React, { useState } from 'react';

interface HeaderProps {
  onOpenGuide: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src="https://eiv.edu.vn/wp-content/uploads/2024/04/logo-web2.png" 
            alt="EIV Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
          <div className="h-8 md:h-12 w-px bg-slate-200"></div>
          <span className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tighter">
            Recruitment <span className="text-[#F26522]">System</span>
          </span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <button 
            onClick={onOpenGuide}
            className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1 cursor-pointer bg-transparent"
          >
            HƯỚNG DẪN
          </button>
          <a 
            href="https://loc-cv.vercel.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1"
          >
            CV SCANNER
          </a>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); alert("Tính năng đang phát triển: Ứng dụng hỗ trợ tạo câu hỏi và chấm điểm phỏng vấn giáo viên."); }}
            className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1"
          >
            TRỢ LÝ PHỎNG VẤN
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-slate-600 hover:text-[#F26522] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col p-6 space-y-6 text-sm font-black uppercase tracking-widest text-slate-600">
            <button 
              onClick={() => { onOpenGuide(); setIsMobileMenuOpen(false); }}
              className="text-left hover:text-[#F26522] transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full mr-3"></span>
              HƯỚNG DẪN
            </button>
            <a 
              href="https://loc-cv.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F26522] transition-colors flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full mr-3"></span>
              CV SCANNER
            </a>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                setIsMobileMenuOpen(false);
                alert("Tính năng đang phát triển: Ứng dụng hỗ trợ tạo câu hỏi và chấm điểm phỏng vấn giáo viên."); 
              }}
              className="hover:text-[#F26522] transition-colors flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-[#F26522] rounded-full mr-3"></span>
              TRỢ LÝ PHỎNG VẤN
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
