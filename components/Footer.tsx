
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 print:hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F26522]"></div>
            <span>© {new Date().getFullYear()} Nam Nguyen - Powered by Gemini</span>
          </div>
          <div className="flex items-center space-x-6">
            <a 
              href="https://eiv.edu.vn" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#F26522] transition-all"
            >
              EIV Education
            </a>
            <span className="text-slate-200">/</span>
            <span className="text-slate-300 italic font-medium lowercase tracking-normal">
              Internal Recruitment Tool v2.1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
