
export interface CandidateSidebarInfo {
  name: string;
  nationality: string;
  gender: string;
}

export interface CVAnalysisResult {
  matchScore: number;
  optimizedCV: string;
  sidebarInfo: CandidateSidebarInfo;
  education: string[];
  experience: {
    title: string;
    company: string;
    period: string;
    points: string[];
  }[];
  keyChanges: string[];
  suggestedKeywords: string[];
  missingSkills: string[];
  strengths: string[];
  photoUrl?: string;
  companyLogoUrl?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface CVData {
  originalText: string;
  jdText: string;
}
