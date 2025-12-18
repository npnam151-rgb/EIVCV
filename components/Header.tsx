
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src="https://eiv.edu.vn/wp-content/uploads/2024/04/logo-web2.png" 
            alt="EIV Logo" 
            className="h-12 w-auto object-contain"
          />
          <div className="h-12 w-px bg-slate-200"></div>
          <span className="text-xl font-black text-slate-800 uppercase tracking-tighter">
            Recruitment <span className="text-[#F26522]">System</span>
          </span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <a href="#" className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1">Hướng dẫn</a>
          <a href="#" className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1">Quy chuẩn CV</a>
          <a href="#" className="hover:text-[#F26522] transition-colors border-b-2 border-transparent hover:border-[#F26522] pb-1">Hỗ trợ kỹ thuật</a>
        </div>

        <div className="flex items-center space-x-4">
           <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-[#F26522] uppercase tracking-widest">Admin Access</span>
             <span className="text-[9px] font-bold text-slate-400 uppercase">Internal use only</span>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#F26522] transition-colors cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
