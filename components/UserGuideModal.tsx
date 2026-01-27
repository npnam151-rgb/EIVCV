
import React, { useEffect } from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Hướng dẫn sử dụng</h2>
            <p className="text-xs font-bold text-[#F26522] uppercase tracking-widest mt-1">EIV AI CV Tailor Pro</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-8 space-y-10">
          
          {/* Section 1: Quy trình tổng quan */}
          <section>
            <h3 className="flex items-center text-lg font-black text-slate-800 mb-6">
              <span className="w-8 h-8 rounded-lg bg-[#F26522] text-white flex items-center justify-center text-sm mr-3 shadow-md shadow-orange-200">01</span>
              QUY TRÌNH XỬ LÝ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="mb-3 text-[#F26522]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">Bước 1: Nhập liệu</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Tải lên CV gốc (PDF/Word), JD (Mô tả công việc) và đặc biệt là <span className="font-bold text-slate-700">Ảnh chân dung</span>.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="mb-3 text-[#F26522]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">Bước 2: AI Tối ưu</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Hệ thống phân tích, chọn lọc từ khóa ATS, cắt ảnh chuẩn 3:4 và dàn trang tự động theo mẫu EIV.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="mb-3 text-[#F26522]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <h4 className="font-bold text-slate-900 text-sm uppercase mb-2">Bước 3: Chỉnh sửa & Xuất</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Sửa trực tiếp trên giao diện, yêu cầu AI viết lại (Refine) và xuất ra file PDF chất lượng cao.</p>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100 w-full"></div>

          {/* Section 2: Chi tiết tính năng */}
          <section>
            <h3 className="flex items-center text-lg font-black text-slate-800 mb-6">
              <span className="w-8 h-8 rounded-lg bg-[#F26522] text-white flex items-center justify-center text-sm mr-3 shadow-md shadow-orange-200">02</span>
              CÁC TÍNH NĂNG CHÍNH
            </h3>
            
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">A</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase mb-1">Chỉnh sửa trực tiếp (Live Editing)</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bạn có thể nhấp chuột vào <span className="bg-yellow-100 px-1 rounded font-bold">bất kỳ dòng chữ nào</span> trên bản xem trước CV để sửa lỗi chính tả, thay đổi ngày tháng hoặc viết lại câu văn. Giao diện hoạt động như MS Word.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">B</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase mb-1">AI Refinement (Tái tối ưu)</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sau khi có kết quả, nếu bạn chưa ưng ý, hãy dùng công cụ <strong>AI Refinement</strong> ở cột bên trái. Nhập yêu cầu (VD: "Thêm kinh nghiệm làm việc tại VUS năm 2020", "Nhấn mạnh kỹ năng quản lý lớp học") và AI sẽ viết lại CV mà không làm mất định dạng.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">C</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase mb-1">Tùy biến Template</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Bạn có thể chỉnh sửa các thông tin cố định của EIV như: Địa chỉ văn phòng, Tiêu đề giới thiệu, hoặc <strong>Ẩn/Hiện Logo EIV</strong> (nút gạt ở góc trên bên phải trang CV) để phù hợp với nhu cầu in ấn.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-100 w-full"></div>

          {/* Section 3: Lưu ý */}
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
             <h3 className="flex items-center text-sm font-black text-amber-800 uppercase mb-3">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Lưu ý quan trọng
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs font-medium text-amber-900/80">
              <li><strong>Ảnh chân dung:</strong> Bắt buộc phải có để AI tự động cắt (Crop) theo tỷ lệ 3:4 chuẩn CV giáo viên.</li>
              <li><strong>Thông tin bổ sung:</strong> Nếu CV gốc của ứng viên quá sơ sài, hãy điền thêm thông tin vào ô "Thông tin bổ sung" ở bước nhập liệu để AI có thêm dữ liệu viết bài.</li>
              <li><strong>Xuất PDF:</strong> Quá trình xuất PDF có thể mất vài giây để render hình ảnh chất lượng cao. Vui lòng kiên nhẫn và không tải lại trang.</li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#F26522] text-white font-bold rounded-xl shadow-lg hover:bg-[#d44d18] transition-all text-sm uppercase tracking-wide"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
