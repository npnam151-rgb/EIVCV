
import React from 'react';
import { CVAnalysisResult } from '../types';

interface EIVTemplateProps {
  result: CVAnalysisResult;
}

const DEFAULT_LOGO_URL = 'https://eiv.edu.vn/wp-content/uploads/2024/04/logo-web2.png';

const EIVTemplate: React.FC<EIVTemplateProps> = ({ result }) => {
  // Common font stack for Helvetica
  const helveticaFont = { fontFamily: 'Helvetica, Arial, sans-serif' };

  /**
   * DYNAMIC PAGE SPLITTING LOGIC
   * Instead of splitting by number of items, we split by estimated height (points/lines)
   */
  const splitExperiencesIntoPages = () => {
    const pages: any[] = [];
    let currentExpList: any[] = [];
    
    // Weights (estimated space consumption)
    const UNIT_LIMIT_PAGE_1 = 130; // Page 1 has Education section
    const UNIT_LIMIT_OTHER = 180;  
    const WEIGHT_EXP_HEADER = 15;   // Title + Company + Period
    const WEIGHT_BULLET = 6;        // One bullet point
    const WEIGHT_EDUCATION = 45;    // Total Education section height estimate

    let currentWeight = WEIGHT_EDUCATION; // Start with Education for page 1
    let isFirstPage = true;

    result.experience.forEach((exp) => {
      const expWeight = WEIGHT_EXP_HEADER + (exp.points.length * WEIGHT_BULLET);
      const limit = isFirstPage ? UNIT_LIMIT_PAGE_1 : UNIT_LIMIT_OTHER;

      if (currentWeight + expWeight > limit && currentExpList.length > 0) {
        // Current page is full, push it and start a new one
        pages.push({
          isFirst: isFirstPage,
          experience: currentExpList,
          showEducation: isFirstPage
        });
        
        // Reset for next page
        currentExpList = [exp];
        currentWeight = expWeight;
        isFirstPage = false;
      } else {
        currentExpList.push(exp);
        currentWeight += expWeight;
      }
    });

    // Push the final page
    if (currentExpList.length > 0) {
      pages.push({
        isFirst: isFirstPage,
        experience: currentExpList,
        showEducation: isFirstPage
      });
    }

    return pages;
  };

  const pages = splitExperiencesIntoPages();

  const Sidebar = ({ hideInfo = false }: { hideInfo?: boolean }) => (
    <div className="w-[35%] bg-[#F26522] text-white p-8 flex flex-col h-full shrink-0" style={helveticaFont}>
      {/* Photo Container */}
      <div className="mb-8 overflow-hidden rounded-none border-[3px] border-white shadow-lg bg-slate-200 relative w-full aspect-[3/4]">
        {result.photoUrl ? (
          <img 
            src={result.photoUrl} 
            alt="Teacher" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-24 h-24 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info Header */}
      <div className="mb-10 space-y-2">
        <h2 className="text-[18px] font-black leading-tight uppercase mb-4 tracking-tight border-b-2 border-white/30 pb-2">
          Teacher from EIV
        </h2>
        <div className="space-y-2">
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Nationality:</span> {result.sidebarInfo.nationality}
          </p>
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Gender:</span> {result.sidebarInfo.gender}
          </p>
        </div>
      </div>

      {/* Brand Mission Section */}
      <div className="space-y-4 mb-10">
        <h2 className="text-[18px] font-black uppercase tracking-tighter">What is EIV ?</h2>
        <p className="text-[12px] leading-relaxed font-light">
          EIV operates in recruiting, managing and supplying high quality Native English Teachers in Vietnam.
        </p>
        <p className="text-[12px] leading-relaxed font-light">
          Our mission is to bring the international standard in English training to Vietnam with modern and effective study methodology.
        </p>
      </div>

      {/* Locations Section */}
      <div className="mt-auto space-y-4 text-[12px] leading-[1.3] font-light pt-6 border-t border-white/20">
        <div>
          <p className="font-black uppercase mb-0.5">EIV – Ho Chi Minh</p>
          <p>Add: 179EF Cach Mang Thang 8, W5, D3.</p>
          <p>Phone: 028 7309 9959</p>
        </div>
        <div>
          <p className="font-black uppercase mb-0.5">EIV - Ha Noi</p>
          <p>Add: F1, Platinum Residences, 6 Nguyen Cong Hoan, Ba Dinh.</p>
          <p>Phone: 028 7309 9959</p>
        </div>
        <div>
          <p className="font-black uppercase mb-0.5">EIV - Da Nang</p>
          <p>Add: F8, Cevimetal Building, 69 Quang Trung, Hai Chau.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="cv-pages-container" className="flex flex-col space-y-8 items-center bg-slate-200/20 p-8 print:p-0 print:space-y-0" style={helveticaFont}>
      {pages.map((page, pIdx) => (
        <div key={pIdx} className="a4-page shadow-2xl flex print:shadow-none mb-8 last:mb-0 shrink-0 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="w-[65%] p-10 pt-12 flex flex-col relative h-full bg-white">
            {/* Logo at Top Right */}
            <div className="absolute top-8 right-8">
              <img 
                src={result.companyLogoUrl || DEFAULT_LOGO_URL} 
                alt="Logo" 
                className="w-28 h-auto object-contain" 
              />
            </div>

            {/* Candidate Name: Size 24, at Top, Wrap allowed, Avoid Logo */}
            <div className="mb-10 mt-2 pr-32">
              <h1 className="text-[24px] font-black tracking-tight uppercase leading-[1.1] text-slate-900 break-words">
                {result.sidebarInfo.name}
              </h1>
            </div>

            {/* Education Section */}
            {page.showEducation && (
              <div className="mb-8">
                <h3 className="text-[#F26522] text-[18px] font-black uppercase mb-4 flex items-center">
                  EDUCATION
                </h3>
                <div className="space-y-3">
                  {result.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold">➢</span>
                      <p className="text-[12px] font-bold leading-tight uppercase text-slate-800">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            <div className="flex-1">
              <h3 className="text-[#F26522] text-[18px] font-black uppercase mb-4">
                PROFESSIONAL EXPERIENCE
              </h3>
              <div className="space-y-6">
                {page.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold">➢</span>
                      <div className="flex-1">
                        <p className="text-[12px] font-black uppercase text-slate-900 leading-tight">
                          {exp.title}, {exp.company}
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 italic">
                          ({exp.period}):
                        </p>
                      </div>
                    </div>
                    <ul className="pl-6 space-y-1.5">
                      {exp.points.map((point: string, pIdx: number) => (
                        <li key={pIdx} className="text-[12px] list-disc pl-1 leading-relaxed text-slate-700 font-medium">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Numbering */}
            <div className="absolute bottom-6 right-8 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
              Page {pIdx + 1} of {pages.length}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EIVTemplate;
