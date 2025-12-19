
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
    if (!process.env.API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const parts: any[] = [
      {
        text: `Bạn là chuyên gia nhân sự tại EIV Education. 
        NHIỆM VỤ:
        1. Trích xuất và tối ưu hóa CV giáo viên theo chuẩn EIV.
        2. Tối ưu hóa thuật ngữ ESL chuyên ngành.
        
        QUY TẮC DÀN TRANG THEO SỐ LƯỢ lượng KINH NGHIỆM (QUAN TRỌNG NHẤT):
        - Nếu ứng viên có ≤ 4 mục kinh nghiệm: BẮT BUỘC viết chi tiết (mỗi mục 4-6 bullet points) để dồn toàn bộ vào 1 trang A4 thật đầy đặn và chuyên nghiệp.
        - Nếu ứng viên có > 4 mục kinh nghiệm: Hãy chọn lọc những mục quan trọng nhất, và chuẩn bị để nội dung dàn sang trang thứ 2 (mục thứ 5 trở đi sẽ nằm ở trang 2).
        - Tuyệt đối không để trang 2 chỉ có vài dòng lẻ loi. Nếu có mục thứ 5, hãy viết đủ dài để trang 2 chiếm ít nhất 1/2 diện tích.
        
        Mục tiêu: Tạo ra bản CV cân đối về mặt thị giác dựa trên số lượng đầu mục kinh nghiệm.`
      }
    ];

    if (typeof cvData === 'string') {
      parts.push({ text: `CANDIDATE CV CONTENT:\n${cvData}` });
    } else {
      parts.push({ text: "CANDIDATE CV FILE:" });
      parts.push(cvData);
    }

    if (typeof jdData === 'string') {
      // Fixed typo: changed jdText to jdData
      parts.push({ text: `JOB DESCRIPTION (JD) CONTENT:\n${jdData}` });
    } else {
      parts.push({ text: "JOB DESCRIPTION (JD) FILE:" });
      parts.push(jdData);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Sử dụng Flash để tránh timeout trên Vercel Hobby (10s)
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: CV_OPTIMIZER_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 } // Tắt thinking để phản hồi cực nhanh
      },
    });

    if (!response.text) throw new Error("AI_NO_RESPONSE");
    return JSON.parse(response.text) as CVAnalysisResult;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
