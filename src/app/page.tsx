"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, signInWithMock, loading, isMock } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "about">("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động chuyển hướng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLiveLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    
    // Nếu sử dụng live Supabase Auth
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMsg(error.message === "Invalid login credentials" ? "Email hoặc mật khẩu không chính xác!" : error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg("Không thể kết nối đến máy chủ Supabase!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMockLogin = (emailStr: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      signInWithMock(emailStr, "");
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang khởi động Hydrotech Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-[#090e1a] relative overflow-hidden px-4">
      {/* Hiệu ứng Glow nền */}
      <div className="radial-glow" style={{ top: "-10%", left: "-10%" }}></div>
      <div className="radial-glow" style={{ bottom: "-10%", right: "-10%" }}></div>

      <div className="w-full max-w-md glass-panel p-8 relative z-10">
        {/* Logo Hydrotech */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-3xl shadow-lg shadow-sky-500/20 mb-3">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">HYDROTECH</h1>
          <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mt-1">Platform Quản lý Dự án & Thi công</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "login"
                ? "text-sky-400 border-b-2 border-sky-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
              activeTab === "about"
                ? "text-sky-400 border-b-2 border-sky-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Về Hydrotech
          </button>
        </div>

        {activeTab === "login" ? (
          <div>
            {/* Live Login Form */}
            <form onSubmit={handleLiveLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Doanh nghiệp</label>
                <input
                  type="email"
                  required
                  placeholder="name@hydrotech.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mật khẩu</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0d1527] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 rounded-xl text-sm"
              >
                {isSubmitting ? "Đang kết nối..." : "Đăng nhập Hệ thống"}
              </button>
            </form>

            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <span className="relative px-3 bg-[#090e1a] text-xs font-bold text-slate-500 uppercase">
                Hoặc trải nghiệm nhanh (Mock Trial)
              </span>
            </div>

            {/* Quick Login selector */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400 text-center mb-3">
                Nhấp để trải nghiệm giao diện với các phân quyền khác nhau:
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleMockLogin("superadmin@hydrotech.vn")}
                  className="px-3 py-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left text-xs transition-all text-white flex flex-col justify-between"
                >
                  <span className="font-bold text-sky-400">Super Admin</span>
                  <span className="text-[10px] text-slate-500 mt-1">Quản lý Hệ thống</span>
                </button>

                <button
                  onClick={() => handleMockLogin("admin@hydrotech.vn")}
                  className="px-3 py-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left text-xs transition-all text-white flex flex-col justify-between"
                >
                  <span className="font-bold text-emerald-400">Tenant Admin</span>
                  <span className="text-[10px] text-slate-500 mt-1">Admin Doanh nghiệp</span>
                </button>

                <button
                  onClick={() => handleMockLogin("pm@hydrotech.vn")}
                  className="px-3 py-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left text-xs transition-all text-white flex flex-col justify-between"
                >
                  <span className="font-bold text-indigo-400">Project Manager</span>
                  <span className="text-[10px] text-slate-500 mt-1">Quản lý Tiến độ</span>
                </button>

                <button
                  onClick={() => handleMockLogin("engineer@hydrotech.vn")}
                  className="px-3 py-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left text-xs transition-all text-white flex flex-col justify-between"
                >
                  <span className="font-bold text-amber-400">Site Engineer</span>
                  <span className="text-[10px] text-slate-500 mt-1">Nhật ký & Voice-to-Text</span>
                </button>
              </div>

              <button
                onClick={() => handleMockLogin("inspector@hydrotech.vn")}
                className="w-full mt-2 px-3 py-2 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-center text-xs transition-all text-slate-300"
              >
                Đăng nhập với vai trò <span className="font-bold text-pink-400">Giám sát / Chủ đầu tư</span> (Xem báo cáo)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-slate-300 text-sm space-y-4">
            <h3 className="text-white font-bold text-base">Giải pháp chuyên nghiệp cho Hydrotech</h3>
            <p>
              Ứng dụng <strong>PWA All-in-One</strong> thiết kế đặc thù cho kỹ sư hiện trường thi công lắp đặt và cơ điện.
            </p>
            <ul className="space-y-2 list-disc list-inside text-xs text-slate-400">
              <li>Nhập nhật ký thi công rảnh tay bằng giọng nói tiếng Việt.</li>
              <li>Chụp ảnh, tự động nén ảnh chất lượng cao ngay tại hiện trường.</li>
              <li>Theo dõi biểu đồ tiến độ chuẩn xác, cập nhật % tiến độ linh hoạt.</li>
              <li>Xuất file PDF nhật ký chuẩn Nghị định 06/2021/NĐ-CP của Bộ Xây Dựng.</li>
              <li>Cách ly dữ liệu an toàn tuyệt đối và phân quyền hệ thống chặt chẽ.</li>
            </ul>
            <p className="text-xs text-sky-400 italic">
              Lưu ý: Bạn có thể cài đặt ứng dụng này làm phím tắt màn hình bằng cách mở Menu trình duyệt &rarr; Chọn &quot;Thêm vào màn hình chính&quot; (Add to Home Screen).
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-center text-[10px] text-slate-600 z-10 font-bold uppercase tracking-widest">
        © 2026 HYDROTECH CO., LTD. ALL RIGHTS RESERVED
      </div>
    </div>
  );
}
