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

        {/* Cụm biểu tượng profile đã được loại bỏ tại đây */}
        <div className="w-12 h-12 lg:hidden"></div>
      </div>
    </header>
  );
};

export default Header;