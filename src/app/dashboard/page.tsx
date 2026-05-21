"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getProjects, getDiaries, Project, ConstructionDiary } from "@/lib/mockData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [diaries, setDiaries] = useState<ConstructionDiary[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setProjects(getProjects());
      setDiaries(getDiaries());
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải bảng tin...</p>
        </div>
      </div>
    );
  }

  // Thống kê số lượng
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter((p) => p.status === "ongoing").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const planningProjects = projects.filter((p) => p.status === "planning").length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen text-slate-900 font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner chào mừng & Hành động nhanh */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-sky-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Xin chào, {profile?.full_name || "Kỹ sư"}! 👋
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              Chào mừng trở lại trung tâm quản lý dự án Hydrotech. Bạn có thể theo dõi tiến độ thi công, quản lý hồ sơ và cập nhật nhật ký trực tiếp từ đây.
            </p>
          </div>
          
          <div className="flex gap-3 relative z-10">
            {profile && ["engineer", "super_admin", "tenant_admin", "pm"].includes(profile.role) && (
              <button
                onClick={() => router.push(`/projects/${projects[0]?.id || "proj-1"}/diaries/new`)}
                className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-600/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
              >
                <span>📝</span> Viết Nhật Ký
              </button>
            )}
            <Link
              href="/projects"
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>📂</span> Quản lý Dự án
            </Link>
          </div>
        </div>

        {/* Khối Thống kê */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">📊</div>
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tổng Dự án</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{totalProjects}</span>
              <span className="text-sm text-slate-500 font-medium">dự án</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">⚡</div>
              <span className="text-xs font-bold uppercase text-sky-600 tracking-wider">Đang thi công</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{ongoingProjects}</span>
              <span className="text-sm text-slate-500 font-medium">dự án</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">✅</div>
              <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Hoàn thành</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{completedProjects}</span>
              <span className="text-sm text-slate-500 font-medium">dự án</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">📋</div>
              <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">Lập kế hoạch</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-800">{planningProjects}</span>
              <span className="text-sm text-slate-500 font-medium">dự án</span>
            </div>
          </div>
        </section>

        {/* Bố cục chia hai cột: Bảng dự án & Nhật ký gần đây */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Dự án nổi bật (2/3 chiều rộng) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Dự án đang triển khai
              </h3>
              <Link href="/projects" className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                Xem tất cả &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                  {/* Status badge */}
                  <div className="absolute top-6 right-6">
                    {proj.status === "ongoing" && <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Đang thi công</span>}
                    {proj.status === "completed" && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Đã hoàn thành</span>}
                    {proj.status === "planning" && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Lập kế hoạch</span>}
                  </div>

                  <div className="flex flex-col items-start pr-32">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase tracking-widest mb-2">{proj.code}</span>
                    <h4 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-sky-700 transition-colors">{proj.name}</h4>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{proj.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">📍</span>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Địa điểm</div>
                        <div className="text-slate-700 font-semibold">{proj.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">🤝</span>
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Đối tác/Khách hàng</div>
                        <div className="text-slate-700 font-semibold">{proj.client}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      {proj.start_date} &rarr; {proj.end_date}
                    </div>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="px-4 py-2 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-sky-700 text-xs font-bold rounded-lg transition-all shadow-sm"
                    >
                      Chi tiết dự án
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Nhật ký thi công mới nhất (1/3 chiều rộng) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Nhật ký gần đây
            </h3>

            <div className="space-y-4">
              {diaries.length > 0 ? (
                diaries.map((diary) => {
                  const proj = projects.find((p) => p.id === diary.project_id);
                  return (
                    <div key={diary.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group">
                      <div className="flex justify-between items-start">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {diary.report_date}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded">{diary.weather_temp}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-sky-700 transition-colors">
                          {proj ? proj.name : "Dự án Hydrotech"}
                        </h4>
                        <span className="text-[11px] text-slate-500 mt-1 block font-medium">Người lập: <span className="text-slate-700">{diary.engineer_name}</span></span>
                      </div>

                      <p className="text-sm text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                        &quot;{diary.work_descriptions}&quot;
                      </p>

                      <div className="pt-3 mt-1 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          {diary.photos?.length || 0} Ảnh đính kèm
                        </span>
                        <Link
                          href={`/projects/${diary.project_id}?tab=diaries`}
                          className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
                  <span className="text-3xl">📭</span>
                  Chưa có nhật ký thi công nào được ghi nhận.
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
