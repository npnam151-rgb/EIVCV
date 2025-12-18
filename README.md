
# CV Tailor Pro - EIV Recruitment Tool

Ứng dụng AI giúp tối ưu hóa CV giáo viên theo mẫu chuẩn EIV Education.

## Hướng dẫn Triển khai lên Vercel

1. **GitHub:** Đẩy mã nguồn lên một repo GitHub cá nhân.
2. **Vercel:**
   - Truy cập [vercel.com](https://vercel.com).
   - Import Project từ GitHub.
   - Trong phần **Environment Variables**, thêm:
     - `API_KEY`: Mã API Gemini của bạn (lấy tại [Google AI Studio](https://aistudio.google.com/)).
3. **Deploy:** Nhấn nút Deploy.

## Lưu ý về Bảo mật
Biến môi trường `process.env.API_KEY` sẽ được Vercel tự động tiêm vào môi trường thực thi của ứng dụng. Đảm bảo bạn không chia sẻ API Key này công khai.

## Công nghệ sử dụng
- React 19 (ESM)
- Google Gemini 1.5/2.0 API
- Tailwind CSS
- jsPDF & html2canvas (Xuất PDF)
