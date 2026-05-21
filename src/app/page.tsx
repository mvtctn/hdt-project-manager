"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { user, signInWithMock, loading } = useAuth();
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
    
    // Intercept hardcoded admin user
    if (email.trim().toLowerCase() === "info@hydrotech.vn" && password === "123456") {
      setTimeout(() => {
        signInWithMock("info@hydrotech.vn", "");
        setIsSubmitting(false);
        router.push("/dashboard");
      }, 600);
      return;
    }

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
    } catch (err: unknown) {
      console.error(err);
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
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#090e1a] text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Đang khởi động Hydrotech Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-[#090e1a] text-slate-900 dark:text-white">
      {/* LEFT SIDE - BRANDING (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#090e1a] overflow-hidden flex-col justify-between p-12">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-start gap-4">
          <Link href="https://hydrotech.vn" target="_blank" className="hover:opacity-80 transition-opacity block bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
            {/* The user needs to save their logo as public/logo.png */}
            <img src="/logo.png" alt="Hydrotech Logo" className="h-16 w-auto object-contain" onError={(e) => {
              // Fallback to text if logo.png is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-sky-500/20">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">HYDROTECH</span>
            </div>
          </Link>
          <a href="https://hydrotech.vn" target="_blank" className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors">
            &larr; Về trang chủ Hydrotech.vn
          </a>
        </div>

        <div className="relative z-10 max-w-lg mt-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
            Giải pháp quản lý dự án & thi công toàn diện.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            Nền tảng PWA All-in-One thiết kế đặc thù cho kỹ sư hiện trường thi công lắp đặt và cơ điện. Quản lý tiến độ, nhật ký thi công, báo cáo tự động chuẩn xác.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#090e1a] bg-sky-500 flex items-center justify-center text-xs font-bold text-white">JD</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#090e1a] bg-teal-500 flex items-center justify-center text-xs font-bold text-white">VT</div>
              <div className="w-10 h-10 rounded-full border-2 border-[#090e1a] bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">PM</div>
            </div>
            <div className="text-sm font-medium text-slate-400">
              Hàng trăm kỹ sư đang tin dùng
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm font-medium text-slate-500">
          © 2026 HYDROTECH CO., LTD. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-24 xl:px-32 relative bg-white dark:bg-[#090e1a] z-10">
        
        {/* Mobile Header (Visible only on small screens) */}
        <div className="lg:hidden flex flex-col items-center mb-10 w-full max-w-sm">
          <Link href="https://hydrotech.vn" target="_blank" className="mb-4">
            <img src="/logo.png" alt="Hydrotech Logo" className="h-12 w-auto object-contain" onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }} />
            <div className="hidden w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-sky-500/20">
              H
            </div>
          </Link>
          <a href="https://hydrotech.vn" target="_blank" className="text-sky-600 dark:text-sky-400 text-xs font-medium hover:underline mb-2">
            &larr; hydrotech.vn
          </a>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Đăng nhập</h2>
            <p className="text-slate-500 dark:text-slate-400">Chào mừng trở lại. Vui lòng đăng nhập vào hệ thống.</p>
          </div>

          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === "login"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              Đăng nhập
              {activeTab === "login" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-t-md"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                activeTab === "about"
                  ? "text-sky-600 dark:text-sky-400"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              Giới thiệu
              {activeTab === "about" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-t-md"></div>
              )}
            </button>
          </div>

          {activeTab === "login" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <form onSubmit={handleLiveLogin} className="space-y-5">
                {errorMsg && (
                  <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errorMsg}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Doanh nghiệp</label>
                  <input
                    type="email"
                    required
                    placeholder="info@hydrotech.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                    <Link href="#" className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline">Quên mật khẩu?</Link>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-[#0d1527] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/20 hover:shadow-sky-600/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : "Đăng nhập Hệ thống"}
                </button>
              </form>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <span className="relative px-4 bg-white dark:bg-[#090e1a] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Hoặc trải nghiệm nhanh
                </span>
              </div>

              {/* Quick Login selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleMockLogin("info@hydrotech.vn")}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400">Admin</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Toàn quyền hệ thống</div>
                </button>

                <button
                  onClick={() => handleMockLogin("pm@hydrotech.vn")}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Project Mgr</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Quản lý dự án</div>
                </button>

                <button
                  onClick={() => handleMockLogin("engineer@hydrotech.vn")}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Kỹ sư</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cập nhật thi công</div>
                </button>

                <button
                  onClick={() => handleMockLogin("inspector@hydrotech.vn")}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-200 dark:hover:border-amber-500/50 rounded-xl text-left transition-all group"
                >
                  <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400">Giám sát</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Chủ đầu tư / TVGS</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-3">Về Nền tảng Hydrotech</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  Ứng dụng <strong>PWA All-in-One</strong> thiết kế chuyên nghiệp cho lĩnh vực thi công lắp đặt cơ điện và môi trường.
                </p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Ghi nhật ký thi công rảnh tay bằng giọng nói AI (Tiếng Việt)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Đính kèm hình ảnh hiện trường tự động nén dung lượng tối ưu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">✓</div>
                    <span>Xuất báo cáo PDF tự động chuẩn form Nghị định 06/2021/NĐ-CP</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl">
                <p className="text-xs text-sky-800 dark:text-sky-300 flex items-start gap-2">
                  <span className="text-base leading-none">💡</span>
                  <span><strong>Mẹo cài đặt:</strong> Mở menu trình duyệt trên điện thoại và chọn &quot;Thêm vào Màn hình chính&quot; (Add to Home Screen) để sử dụng như một App độc lập.</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
