import React from 'react';
import { CVAnalysisResult } from '../types';

interface EIVTemplateProps {
  result: CVAnalysisResult;
  isEditable?: boolean;
  onUpdate?: (updatedResult: CVAnalysisResult) => void;
}

const EIVTemplate: React.FC<EIVTemplateProps> = ({ result, isEditable = false, onUpdate }) => {
  const helveticaFont = { fontFamily: 'Helvetica, Arial, sans-serif' };
  const LOGO_URL = "https://res.cloudinary.com/dbfngei2f/image/upload/v1766125714/Logo-EIV-Chuan_yaeiyl.png";

  const handleSidebarChange = (field: 'name' | 'nationality' | 'gender', value: string) => {
    if (!onUpdate) return;
    onUpdate({
      ...result,
      sidebarInfo: {
        ...result.sidebarInfo,
        [field]: value
      }
    });
  };

  const handleEducationChange = (idx: number, value: string) => {
    if (!onUpdate) return;
    const newEdu = [...result.education];
    newEdu[idx] = value;
    onUpdate({ ...result, education: newEdu });
  };

  const handleExperienceChange = (expIdx: number, field: string, value: any, pointIdx?: number) => {
    if (!onUpdate) return;
    const newExp = [...result.experience];
    if (pointIdx !== undefined) {
      const newPoints = [...newExp[expIdx].points];
      newPoints[pointIdx] = value;
      newExp[expIdx] = { ...newExp[expIdx], points: newPoints };
    } else {
      newExp[expIdx] = { ...newExp[expIdx], [field]: value };
    }
    onUpdate({ ...result, experience: newExp });
  };

  const splitExperiencesIntoPages = () => {
    const pages: any[] = [];
    let currentExpList: any[] = [];
    
    // Tăng các giới hạn để tận dụng tối đa chiều cao trang A4
    const UNIT_LIMIT_PAGE_1 = 185; // Trang 1 có Header và Education nên giới hạn thấp hơn trang sau một chút
    const UNIT_LIMIT_OTHER = 220;  // Các trang sau chỉ có Experience nên chứa được nhiều hơn
    
    const WEIGHT_EXP_HEADER = 12;   // Trọng số cho tiêu đề công ty/vị trí
    const WEIGHT_BULLET = 5;        // Trọng số cho mỗi dòng mô tả
    const WEIGHT_EDUCATION = 40;    // Trọng số cho phần học vấn

    let currentWeight = WEIGHT_EDUCATION; 
    let isFirstPage = true;

    result.experience.forEach((exp, idx) => {
      const expWeight = WEIGHT_EXP_HEADER + (exp.points.length * WEIGHT_BULLET);
      const limit = isFirstPage ? UNIT_LIMIT_PAGE_1 : UNIT_LIMIT_OTHER;

      // Nếu thêm kinh nghiệm này vào sẽ vượt quá giới hạn trang
      if (currentWeight + expWeight > limit && currentExpList.length > 0) {
        pages.push({
          isFirst: isFirstPage,
          experience: currentExpList,
          showEducation: isFirstPage
        });
        
        currentExpList = [{ ...exp, originalIdx: idx }];
        currentWeight = expWeight;
        isFirstPage = false;
      } else {
        currentExpList.push({ ...exp, originalIdx: idx });
        currentWeight += expWeight;
      }
    });

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

  const EditableText = ({ 
    value, 
    onBlur, 
    className = ""
  }: { 
    value: string, 
    onBlur: (val: string) => void, 
    className?: string
  }) => {
    if (!isEditable) return <span className={className}>{value}</span>;

    return (
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onBlur(e.currentTarget.textContent || "")}
        className={`${className} outline-none border-b border-dashed border-white/40 bg-white/10 px-1 focus:bg-white/20 transition-colors inline-block min-w-[20px]`}
      >
        {value}
      </span>
    );
  };

  const EditableMainText = ({ 
    value, 
    onBlur, 
    className = "" 
  }: { 
    value: string, 
    onBlur: (val: string) => void, 
    className?: string 
  }) => {
    if (!isEditable) return <span className={className}>{value}</span>;

    return (
      <span
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onBlur(e.currentTarget.textContent || "")}
        className={`${className} outline-none border-b border-dashed border-[#F26522]/40 hover:bg-[#F26522]/5 focus:bg-[#F26522]/10 transition-colors px-1 inline-block min-w-[20px]`}
      >
        {value}
      </span>
    );
  };

  const Sidebar = () => (
    <div className="w-[35%] bg-[#F26522] text-white p-8 flex flex-col h-full shrink-0" style={helveticaFont}>
      <div className="mb-8 overflow-hidden rounded-none border-[3px] border-white shadow-lg bg-white relative w-full aspect-[3/4]">
        {result.photoUrl ? (
          <img 
            src={result.photoUrl} 
            alt="Teacher" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <svg className="w-24 h-24 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      <div className="mb-10 space-y-2">
        <h2 className="text-[18px] font-black leading-tight uppercase mb-4 tracking-tight border-b-2 border-white/30 pb-2">
          Teacher from EIV
        </h2>
        <div className="space-y-2">
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Nationality:</span>{' '}
            <EditableText value={result.sidebarInfo.nationality} onBlur={(v) => handleSidebarChange('nationality', v)} />
          </p>
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Gender:</span>{' '}
            <EditableText value={result.sidebarInfo.gender} onBlur={(v) => handleSidebarChange('gender', v)} />
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-[18px] font-black uppercase tracking-tighter">What is EIV ?</h2>
        <p className="text-[12px] leading-relaxed font-light">
          EIV operates in recruiting, managing and supplying high quality Native English Teachers in Vietnam.
        </p>
        <p className="text-[12px] leading-relaxed font-light">
          Our mission is to bring the international standard in English training to Vietnam with modern and effective study methodology.
        </p>
      </div>

      <div className="mt-auto space-y-4 text-[12px] leading-[1.3] font-light pt-6 border-t border-white/20">
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">EIV – Ho Chi Minh</p>
          <p className="text-[10px]">Add: 179EF Cach Mang Thang 8, W5, D3.</p>
          <p className="text-[10px]">Phone: 028 7309 9959</p>
        </div>
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">EIV - Ha Noi</p>
          <p className="text-[10px]">Add: F1, Platinum Residences, 6 Nguyen Cong Hoan, Ba Dinh.</p>
          <p className="text-[10px]">Phone: 028 7309 9959</p>
        </div>
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">EIV - Da Nang</p>
          <p className="text-[10px]">Add: F8, Cevimetal Building, 69 Quang Trung, Hai Chau.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="cv-pages-container" className="flex flex-col space-y-8 items-center bg-slate-200/20 p-8 print:p-0 print:space-y-0" style={helveticaFont}>
      {pages.map((page, pIdx) => (
        <div key={pIdx} className="a4-page shadow-2xl flex print:shadow-none mb-8 last:mb-0 shrink-0 overflow-hidden">
          <Sidebar />

          <div className="w-[65%] p-10 pt-12 flex flex-col relative h-full bg-white">
            <div className="absolute top-8 right-8 w-32 h-auto">
              <img 
                src={LOGO_URL} 
                alt="EIV Logo" 
                crossOrigin="anonymous"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="mb-10 mt-2 pr-32">
              <h1 className="text-[24px] font-black tracking-tight uppercase leading-[1.1] text-slate-900 break-words">
                <EditableMainText value={result.sidebarInfo.name} onBlur={(v) => handleSidebarChange('name', v)} />
              </h1>
            </div>

            {page.showEducation && (
              <div className="mb-8">
                <h3 className="text-[#F26522] text-[18px] font-black uppercase mb-4 flex items-center">
                  EDUCATION
                </h3>
                <div className="space-y-3">
                  {result.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold">➢</span>
                      <p className="text-[12px] font-bold leading-tight uppercase text-slate-800">
                        <EditableMainText value={edu} onBlur={(v) => handleEducationChange(idx, v)} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-[#F26522] text-[18px] font-black uppercase mb-4">
                PROFESSIONAL EXPERIENCE
              </h3>
              <div className="space-y-6">
                {page.experience.map((exp: any, idx: number) => {
                   const originalIdx = exp.originalIdx;
                   return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold">➢</span>
                      <div className="flex-1">
                        <p className="text-[12px] font-black uppercase text-slate-900 leading-tight flex flex-wrap gap-1">
                          <EditableMainText value={exp.title} onBlur={(v) => handleExperienceChange(originalIdx, 'title', v)} />
                          <span>,</span>
                          <EditableMainText value={exp.company} onBlur={(v) => handleExperienceChange(originalIdx, 'company', v)} />
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 italic">
                          <span>(</span>
                          <EditableMainText value={exp.period} onBlur={(v) => handleExperienceChange(originalIdx, 'period', v)} />
                          <span>):</span>
                        </p>
                      </div>
                    </div>
                    <ul className="pl-6 space-y-1.5">
                      {exp.points.map((point: string, pIdx: number) => (
                        <li key={pIdx} className="text-[12px] list-disc pl-1 leading-relaxed text-slate-700 font-medium">
                          <EditableMainText value={point} onBlur={(v) => handleExperienceChange(originalIdx, 'points', v, pIdx)} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )})}
              </div>
            </div>

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