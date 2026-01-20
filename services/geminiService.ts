
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

export const processHeadshot = async (photoData: FileData): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY_MISSING");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Cast config to any to avoid TS errors with preview features like imageConfig in some SDK versions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: photoData.inlineData,
          },
          {
            text: 'Crop this photo to create a professional headshot for a teacher CV. Focus on the face and upper shoulders, and center the subject perfectly. KEEP THE ORIGINAL BACKGROUND. Do not change, modify or replace the original background. The output must be exactly in a 3:4 vertical aspect ratio.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      } as any 
    });

    let base64Result = "";
    // Safe access to candidates and parts to prevent build/runtime errors
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Result = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Result) {
      return photoData.inlineData.data;
    }

    return base64Result;
  } catch (error) {
    console.error("Headshot Processing Error:", error);
    return photoData.inlineData.data;
  }
};

export const optimizeCV = async (
  cvData: string | FileData, 
  jdData: string | FileData,
  additionalInfo?: string
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
        
        QUY TẮC DÀN TRANG THEO SỐ LƯỢNG KINH NGHIỆM (QUAN TRỌNG NHẤT):
        - Nếu ứng viên có ≤ 4 mục kinh nghiệm: BẮT BUỘC viết chi tiết (mỗi mục 4-6 bullet points) để dồn toàn bộ vào 1 trang A4 thật đầy đặn và chuyên nghiệp.
        - Nếu ứng viên có > 4 mục kinh nghiệm: Hãy chọn lọc những mục quan trọng nhất, và chuẩn bị để nội dung dàn sang trang thứ 2 (mục thứ 5 trở đi sẽ nằm ở trang 2).
        - Tuyệt đối không để trang 2 chỉ có vài dòng lẻ loi. Nếu có mục thứ 5, hãy viết đủ dài để trang 2 chiếm ít nhất 1/2 diện tích.
        
        Mục tiêu: Tạo ra bản CV cân đối về mặt thị giác dựa trên số lượng đầu mục kinh nghiệm.`
      }
    ];

    if (additionalInfo && additionalInfo.trim() !== '') {
      parts.push({ 
        text: `ADDITIONAL CANDIDATE INFORMATION (Use this to supplement the CV content, fill in missing gaps, or emphasize specific skills):
        ${additionalInfo}` 
      });
    }

    if (typeof cvData === 'string') {
      parts.push({ text: `CANDIDATE CV CONTENT:\n${cvData}` });
    } else {
      parts.push({ text: "CANDIDATE CV FILE:" });
      // When pushing file data, ensure it matches the Part interface structure if needed, 
      // but the SDK usually handles the object with inlineData correctly.
      parts.push(cvData);
    }

    if (typeof jdData === 'string') {
      parts.push({ text: `JOB DESCRIPTION (JD) CONTENT:\n${jdData}` });
    } else {
      parts.push({ text: "JOB DESCRIPTION (JD) FILE:" });
      parts.push(jdData);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: CV_OPTIMIZER_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    if (!response.text) throw new Error("AI_NO_RESPONSE");
    return JSON.parse(response.text) as CVAnalysisResult;
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
