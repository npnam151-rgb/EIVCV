
import { GoogleGenAI, Type } from "@google/genai";
import { CVAnalysisResult } from "../types";

const CV_OPTIMIZER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description: "A score from 0-100 indicating how well the CV matches the JD."
    },
    sidebarInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        nationality: { type: Type.STRING },
        gender: { type: Type.STRING }
      },
      required: ["name", "nationality", "gender"]
    },
    education: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          period: { type: Type.STRING },
          points: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "company", "period", "points"]
      }
    },
    optimizedCV: {
      type: Type.STRING
    },
    keyChanges: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    suggestedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    missingSkills: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["matchScore", "sidebarInfo", "education", "experience", "optimizedCV", "keyChanges", "suggestedKeywords", "missingSkills", "strengths"]
};

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export const optimizeCV = async (
  cvData: string | FileData, 
  jdData: string | FileData
): Promise<CVAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [
      {
        text: `Bạn là chuyên gia nhân sự tại EIV Education. 
        NHIỆM VỤ:
        1. Trích xuất thông tin từ CV ứng viên.
        2. Tối ưu hóa nội dung CV để phù hợp nhất với JD (Job Description) được cung cấp, theo chuẩn phong cách chuyên nghiệp của EIV.
        3. Tối ưu hóa kinh nghiệm giảng dạy sử dụng thuật ngữ tiếng Anh chuyên ngành (ESL, TEFL, TESOL, Classroom Management, Lesson Planning...).
        
        QUY TẮC DÀN TRANG A4 (CỰC KỲ QUAN TRỌNG):
        - Ưu tiên dồn nội dung vào 1 trang duy nhất nếu tổng lượng kinh nghiệm không quá lớn. Nếu cần, hãy tóm tắt các kinh nghiệm cũ hoặc ít liên quan để trang 1 không bị tràn.
        - Nếu buộc phải sang trang 2, trang 2 phải chứa ít nhất 3/4 nội dung của mục kinh nghiệm cuối cùng đó, hoặc chứa ít nhất 2 mục kinh nghiệm đầy đủ. Đừng để trang 2 chỉ có 1-2 dòng lẻ loi.
        - Điều chỉnh linh hoạt số lượng bullet points: 
          + Tăng chi tiết nếu CV quá ngắn (để lấp đầy trang 1).
          + Cắt bớt/viết gọn nếu CV bị tràn trang 1 chỉ một chút (để dồn vào 1 trang).
        - Mục tiêu: Một bản CV cân đối, chuyên nghiệp và đầy đặn.

        4. Trả về kết quả JSON theo đúng schema quy định.`
      }
    ];

    if (typeof cvData === 'string') {
      parts.push({ text: `CANDIDATE CV CONTENT:\n${cvData}` });
    } else {
      parts.push({ text: "CANDIDATE CV FILE:" });
      parts.push(cvData);
    }

    if (typeof jdData === 'string') {
      parts.push({ text: `JOB DESCRIPTION (JD) CONTENT:\n${jdData}` });
    } else {
      parts.push({ text: "JOB DESCRIPTION (JD) FILE:" });
      parts.push(jdData);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: CV_OPTIMIZER_SCHEMA,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    if (!response.text) throw new Error("AI không phản hồi");
    return JSON.parse(response.text) as CVAnalysisResult;
  } catch (error: any) {
    throw error;
  }
};
