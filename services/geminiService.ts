
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
      items: { type: Type.STRING },
      description: "List of degrees and certifications, formatted for EIV template."
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
      type: Type.STRING,
      description: "The full CV in Markdown for reference."
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
        text: `Bạn là chuyên gia nhân sự cao cấp tại EIV Education Việt Nam. 
        Nhiệm vụ của bạn là trích xuất và tối ưu hóa thông tin từ CV ứng viên để điền vào mẫu hồ sơ giáo viên bản ngữ chuẩn của EIV.
        
        QUY TẮC TỐI ƯU:
        1. Trích xuất chính xác Tên (Full Name), Quốc tịch, Giới tính.
        2. Phần Education: Liệt kê các bằng cấp (Bachelor, Master) và chứng chỉ giảng dạy (TEFL, TESOL, CELTA).
        3. Phần Experience: Tối ưu hóa các gạch đầu dòng để làm nổi bật kỹ năng giảng dạy, quản lý lớp học và các thành tích cụ thể. Sử dụng động từ hành động mạnh (Taught, Developed, Managed, Evaluated).
        4. Match Score: Đánh giá sự phù hợp giữa CV và JD (0-100%).
        5. Đảm bảo ngôn ngữ sử dụng là Tiếng Anh chuyên nghiệp (cho phần nội dung CV).`
      }
    ];

    // Add CV data part
    if (typeof cvData === 'string') {
      parts.push({ text: `CANDIDATE CV CONTENT:\n${cvData}` });
    } else {
      parts.push({ text: "CANDIDATE CV FILE:" });
      parts.push(cvData);
    }

    // Add JD data part
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
        systemInstruction: "Bạn là chuyên gia tuyển dụng tại EIV Education. Phân tích hồ sơ và tối ưu hóa nội dung để phù hợp với giáo viên bản ngữ dạy Tiếng Anh tại Việt Nam."
      },
    });

    if (!response.text) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    const result = JSON.parse(response.text);
    return result as CVAnalysisResult;
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    
    // Provide a more helpful error message based on common API errors
    let userFriendlyMessage = "Không thể kết nối với trí tuệ nhân tạo.";
    
    if (error.message?.includes("400")) {
      userFriendlyMessage = "Tệp tin không được hỗ trợ hoặc nội dung quá lớn. Hãy thử sử dụng tệp PDF hoặc dán nội dung trực tiếp.";
    } else if (error.message?.includes("429")) {
      userFriendlyMessage = "Hệ thống đang quá tải (Rate limit). Vui lòng đợi 1 phút và thử lại.";
    } else if (error.message) {
      userFriendlyMessage = `Lỗi hệ thống: ${error.message}`;
    }

    throw new Error(userFriendlyMessage);
  }
};
