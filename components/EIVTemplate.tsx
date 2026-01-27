
import React, { useState } from 'react';
import { CVAnalysisResult } from '../types';

interface EIVTemplateProps {
  result: CVAnalysisResult;
  isEditable?: boolean;
  onUpdate?: (updatedResult: CVAnalysisResult) => void;
}

// Configuration interface for customizable template text/elements
interface TemplateConfig {
  showLogo: boolean;
  sidebarTitle: string;
  introTitle: string;
  introText1: string;
  introText2: string;
  hcmTitle: string;
  hcmAdd: string;
  hcmPhone: string;
  hnTitle: string;
  hnAdd: string;
  hnPhone: string;
  dnTitle: string;
  dnAdd: string;
}

const DEFAULT_CONFIG: TemplateConfig = {
  showLogo: true,
  sidebarTitle: "Teacher from EIV",
  introTitle: "What is EIV ?",
  introText1: "EIV operates in recruiting, managing and supplying high quality Native English Teachers in Vietnam.",
  introText2: "Our mission is to bring the international standard in English training to Vietnam with modern and effective study methodology.",
  hcmTitle: "EIV – Ho Chi Minh",
  hcmAdd: "Add: 179EF Cach Mang Thang 8, W5, D3.",
  hcmPhone: "Phone: 028 7309 9959",
  hnTitle: "EIV - Ha Noi",
  hnAdd: "Add: F1, Platinum Residences, 6 Nguyen Cong Hoan, Ba Dinh.",
  hnPhone: "Phone: 028 7309 9959",
  dnTitle: "EIV - Da Nang",
  dnAdd: "Add: F8, Cevimetal Building, 69 Quang Trung, Hai Chau."
};

const HELVETICA_FONT = { fontFamily: 'Helvetica, Arial, sans-serif' };
const LOGO_URL = "https://res.cloudinary.com/dbfngei2f/image/upload/v1766125714/Logo-EIV-Chuan_yaeiyl.png";

// --- Sub-components defined OUTSIDE to prevent re-mounting and focus loss ---

const EditableText = ({ 
  value, 
  onBlur, 
  isEditable,
  className = "",
  multiline = false
}: { 
  value: string, 
  onBlur: (val: string) => void, 
  isEditable: boolean,
  className?: string,
  multiline?: boolean
}) => {
  if (!isEditable) return <span className={className}>{value}</span>;
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onBlur(e.currentTarget.textContent || "")}
      className={`${className} outline-none border-b border-dashed border-white/40 bg-white/10 px-1 focus:bg-white/20 transition-colors inline-block min-w-[20px] hover:bg-white/5 cursor-text`}
      style={{ whiteSpace: multiline ? 'pre-wrap' : 'normal' }}
    >
      {value}
    </span>
  );
};

const EditableMainText = ({ 
  value, 
  onBlur, 
  isEditable,
  className = "" 
}: { 
  value: string, 
  onBlur: (val: string) => void, 
  isEditable: boolean,
  className?: string 
}) => {
  if (!isEditable) return <span className={className}>{value}</span>;
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onBlur(e.currentTarget.textContent || "")}
      className={`${className} outline-none border-b border-dashed border-[#F26522]/40 hover:bg-[#F26522]/5 focus:bg-[#F26522]/10 transition-colors px-1 inline-block min-w-[20px] cursor-text`}
    >
      {value}
    </span>
  );
};

const Sidebar = ({ 
  result, 
  isEditable, 
  onUpdate,
  config,
  onConfigChange
}: { 
  result: CVAnalysisResult, 
  isEditable: boolean, 
  onUpdate?: (res: CVAnalysisResult) => void,
  config: TemplateConfig,
  onConfigChange: (key: keyof TemplateConfig, value: any) => void
}) => {
  
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

  return (
    <div className="w-[35%] bg-[#F26522] text-white px-8 pt-8 pb-[20mm] flex flex-col h-full shrink-0" style={HELVETICA_FONT}>
      <div className="mb-8 overflow-hidden rounded-none border-[3px] border-white shadow-lg bg-white relative w-full aspect-[3/4]">
        {result.photoUrl ? (
          <div 
            style={{ 
              backgroundImage: `url(${result.photoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            className="absolute inset-0 w-full h-full"
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
          <EditableText 
            value={config.sidebarTitle} 
            onBlur={(v) => onConfigChange('sidebarTitle', v)}
            isEditable={isEditable}
          />
        </h2>
        <div className="space-y-2">
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Nationality:</span>{' '}
            <EditableText 
              value={result.sidebarInfo.nationality} 
              onBlur={(v) => handleSidebarChange('nationality', v)} 
              isEditable={isEditable}
            />
          </p>
          <p className="text-[12px] font-medium leading-tight">
            <span className="opacity-80 font-normal">Gender:</span>{' '}
            <EditableText 
              value={result.sidebarInfo.gender} 
              onBlur={(v) => handleSidebarChange('gender', v)} 
              isEditable={isEditable}
            />
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h2 className="text-[18px] font-black uppercase tracking-tighter">
          <EditableText 
            value={config.introTitle} 
            onBlur={(v) => onConfigChange('introTitle', v)}
            isEditable={isEditable}
          />
        </h2>
        <p className="text-[12px] leading-relaxed font-light">
          <EditableText 
            value={config.introText1} 
            onBlur={(v) => onConfigChange('introText1', v)}
            isEditable={isEditable}
            multiline={true}
          />
        </p>
        <p className="text-[12px] leading-relaxed font-light">
          <EditableText 
            value={config.introText2} 
            onBlur={(v) => onConfigChange('introText2', v)}
            isEditable={isEditable}
            multiline={true}
          />
        </p>
      </div>

      <div className="mt-auto space-y-4 text-[12px] leading-[1.3] font-light pt-6 border-t border-white/20">
        {/* HCM Block */}
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">
            <EditableText value={config.hcmTitle} onBlur={(v) => onConfigChange('hcmTitle', v)} isEditable={isEditable} />
          </p>
          <p className="text-[10px]">
            <EditableText value={config.hcmAdd} onBlur={(v) => onConfigChange('hcmAdd', v)} isEditable={isEditable} />
          </p>
          <p className="text-[10px]">
            <EditableText value={config.hcmPhone} onBlur={(v) => onConfigChange('hcmPhone', v)} isEditable={isEditable} />
          </p>
        </div>
        
        {/* HN Block */}
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">
            <EditableText value={config.hnTitle} onBlur={(v) => onConfigChange('hnTitle', v)} isEditable={isEditable} />
          </p>
          <p className="text-[10px]">
             <EditableText value={config.hnAdd} onBlur={(v) => onConfigChange('hnAdd', v)} isEditable={isEditable} />
          </p>
          <p className="text-[10px]">
             <EditableText value={config.hnPhone} onBlur={(v) => onConfigChange('hnPhone', v)} isEditable={isEditable} />
          </p>
        </div>

        {/* DN Block */}
        <div>
          <p className="font-black uppercase mb-0.5 text-[11px]">
             <EditableText value={config.dnTitle} onBlur={(v) => onConfigChange('dnTitle', v)} isEditable={isEditable} />
          </p>
          <p className="text-[10px]">
             <EditableText value={config.dnAdd} onBlur={(v) => onConfigChange('dnAdd', v)} isEditable={isEditable} />
          </p>
        </div>
      </div>
    </div>
  );
};

const EIVTemplate: React.FC<EIVTemplateProps> = ({ result, isEditable = false, onUpdate }) => {
  // Local state for template configuration (static text & display options)
  const [config, setConfig] = useState<TemplateConfig>(DEFAULT_CONFIG);

  const handleConfigChange = (key: keyof TemplateConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
    if (value.trim() === "") {
        newEdu.splice(idx, 1); // Delete if empty
    } else {
        newEdu[idx] = value;
    }
    onUpdate({ ...result, education: newEdu });
  };

  const handleExperienceChange = (expIdx: number, field: string, value: any, pointIdx?: number) => {
    if (!onUpdate) return;
    const newExp = [...result.experience];
    if (pointIdx !== undefined) {
      const newPoints = [...newExp[expIdx].points];
      // Logic: Nếu giá trị trống (người dùng xóa hết chữ), xóa luôn dòng đó khỏi mảng
      if (typeof value === 'string' && value.trim() === '') {
        newPoints.splice(pointIdx, 1);
      } else {
        newPoints[pointIdx] = value;
      }
      newExp[expIdx] = { ...newExp[expIdx], points: newPoints };
    } else {
      newExp[expIdx] = { ...newExp[expIdx], [field]: value };
    }
    onUpdate({ ...result, experience: newExp });
  };

  const splitExperiencesIntoPages = () => {
    const pages: any[] = [];
    let currentExpList: any[] = [];
    
    // Limits adjusted for the new 20mm bottom padding
    const UNIT_LIMIT_PAGE_1 = 200; 
    const UNIT_LIMIT_OTHER = 220;  
    
    const WEIGHT_EXP_HEADER = 12;   
    const WEIGHT_LINE_UNIT = 5.0;   
    const WEIGHT_EDUCATION_HEADER = 20;

    let educationWeight = WEIGHT_EDUCATION_HEADER + (result.education.length * 5);
    let currentWeight = educationWeight; 
    let isFirstPage = true;

    result.experience.forEach((exp, idx) => {
      const pointsWeight = exp.points.reduce((acc, point) => {
        const estimatedLines = Math.ceil(point.length / 70) || 1;
        return acc + (estimatedLines * WEIGHT_LINE_UNIT);
      }, 0);

      const expWeight = WEIGHT_EXP_HEADER + pointsWeight;
      const limit = isFirstPage ? UNIT_LIMIT_PAGE_1 : UNIT_LIMIT_OTHER;
      const tolerance = 15;

      if (currentWeight + expWeight > limit + (currentExpList.length > 0 ? 0 : tolerance)) {
        if (currentExpList.length > 0) {
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

  return (
    <div id="cv-pages-container" className="flex flex-col space-y-8 items-center bg-slate-200/20 p-8 print:p-0 print:space-y-0" style={HELVETICA_FONT}>
      {pages.map((page, pIdx) => (
        <div key={pIdx} className="a4-page shadow-2xl flex print:shadow-none mb-8 last:mb-0 shrink-0 overflow-hidden group">
          
          <Sidebar 
            result={result} 
            isEditable={isEditable} 
            onUpdate={onUpdate}
            config={config}
            onConfigChange={handleConfigChange}
          />

          <div className="w-[65%] px-10 pt-12 pb-[20mm] flex flex-col relative h-full bg-white">
            
            {/* LOGO SECTION with Toggle Control */}
            <div className="absolute top-8 right-8 w-32 h-auto group/logo">
              {config.showLogo && (
                <img 
                  src={LOGO_URL} 
                  alt="EIV Logo" 
                  crossOrigin="anonymous"
                  className="w-full h-auto object-contain"
                />
              )}
              {isEditable && (
                <button
                  onClick={() => handleConfigChange('showLogo', !config.showLogo)}
                  className={`absolute -top-3 -right-3 p-1.5 rounded-full shadow-md text-[10px] font-bold transition-all z-10 ${config.showLogo ? 'bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover/logo:opacity-100' : 'bg-green-100 text-green-600 hover:bg-green-200 opacity-100'}`}
                  title={config.showLogo ? "Ẩn Logo" : "Hiện Logo"}
                >
                  {config.showLogo ? '✕' : '+ LOGO'}
                </button>
              )}
            </div>

            <div className="mb-10 mt-2 pr-32">
              <h1 className="text-[24px] font-black tracking-tight uppercase leading-[1.1] text-slate-900 break-words">
                <EditableMainText 
                  value={result.sidebarInfo.name} 
                  onBlur={(v) => handleSidebarChange('name', v)} 
                  isEditable={isEditable}
                />
              </h1>
            </div>

            {page.showEducation && (
              <div className="mb-8">
                <h3 className="text-[#F26522] text-[18px] font-black uppercase mb-4 flex items-center">
                  EDUCATION
                </h3>
                <div className="space-y-3">
                  {result.education.map((edu, idx) => (
                    <div key={idx} className="flex items-start group/edu relative">
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold shrink-0 mt-[2px]">➢</span>
                      <p className="text-[12px] font-bold leading-tight uppercase text-slate-800">
                        <EditableMainText 
                          value={edu} 
                          onBlur={(v) => handleEducationChange(idx, v)} 
                          isEditable={isEditable}
                        />
                      </p>
                       {isEditable && (
                        <button
                          onClick={() => handleEducationChange(idx, "")}
                          className="absolute -left-6 top-0 text-red-300 hover:text-red-500 opacity-0 group-hover/edu:opacity-100 transition-opacity"
                          title="Xóa dòng này"
                        >
                          ×
                        </button>
                      )}
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
                      <span className="text-[#F26522] text-[12px] mr-2 leading-tight font-bold shrink-0 mt-[2px]">➢</span>
                      <div className="flex-1">
                        <p className="text-[12px] font-black uppercase text-slate-900 leading-tight flex flex-wrap gap-1">
                          <EditableMainText 
                            value={exp.title} 
                            onBlur={(v) => handleExperienceChange(originalIdx, 'title', v)} 
                            isEditable={isEditable}
                          />
                          <span>,</span>
                          <EditableMainText 
                            value={exp.company} 
                            onBlur={(v) => handleExperienceChange(originalIdx, 'company', v)} 
                            isEditable={isEditable}
                          />
                        </p>
                        <p className="text-[11px] font-bold text-slate-500 italic">
                          <span>(</span>
                          <EditableMainText 
                            value={exp.period} 
                            onBlur={(v) => handleExperienceChange(originalIdx, 'period', v)} 
                            isEditable={isEditable}
                          />
                          <span>):</span>
                        </p>
                      </div>
                    </div>
                    {/* Updated to Flex layout for bullet points to fix alignment issues in PDF */}
                    <div className="space-y-1.5 pl-6">
                      {exp.points.map((point: string, pIdx: number) => (
                        <div key={pIdx} className="flex items-start group/point relative">
                          <span className="text-slate-800 text-[18px] mr-2 leading-none shrink-0 select-none" style={{ marginTop: '-4px' }}>•</span>
                          <div className="text-[12px] leading-relaxed text-slate-700 font-medium text-justify flex-1">
                            <EditableMainText 
                              value={point} 
                              onBlur={(v) => handleExperienceChange(originalIdx, 'points', v, pIdx)} 
                              isEditable={isEditable}
                            />
                          </div>
                          {isEditable && (
                            <button
                               onClick={() => handleExperienceChange(originalIdx, 'points', '', pIdx)}
                               className="absolute -left-5 top-0.5 text-red-300 hover:text-red-500 opacity-0 group-hover/point:opacity-100 transition-opacity font-bold text-lg leading-none"
                               title="Xóa bullet này"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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
