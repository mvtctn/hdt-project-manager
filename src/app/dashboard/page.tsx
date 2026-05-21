"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getProjects, getDiaries, Project, ConstructionDiary } from "@/lib/mockData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, profile, loading, isMock } = useAuth();
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
      // Trong môi trường demo/mock hoặc live: nạp dữ liệu
      setProjects(getProjects());
      setDiaries(getDiaries());
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang tải bảng tin...</p>
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
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      {/* Glare effects */}
      <div className="radial-glow" style={{ top: "0%", left: "10%", opacity: 0.5 }}></div>
      
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Banner chào mừng & Hành động nhanh */}
        <div className="glass-panel p-6 bg-gradient-to-r from-sky-950/20 via-indigo-950/20 to-teal-950/20 border-sky-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Xin chào, {profile?.full_name || "Kỹ sư"}!
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Hệ thống PWA đã được kích hoạt. Bạn đang sử dụng công cụ quản lý tích hợp của công ty **Hydrotech** tại hiện trường.
            </p>
          </div>
          
          <div className="flex gap-3">
            {profile?.role === "engineer" && (
              <button
                onClick={() => router.push(`/projects/${projects[0]?.id || "proj-1"}/diaries/new`)}
                className="btn-primary px-5 py-3 rounded-xl text-sm"
              >
                📝 Viết Nhật Ký Hôm Nay
              </button>
            )}
            <Link
              href="/projects"
              className="btn-secondary px-5 py-3 rounded-xl text-sm font-semibold flex items-center justify-center"
            >
              📂 Xem các Dự án
            </Link>
          </div>
        </div>

        {/* Khối Thống kê */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 border-slate-800/80 bg-slate-900/30 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tổng số Dự án</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-white">{totalProjects}</span>
              <span className="text-xs text-sky-400 font-bold">dự án</span>
            </div>
          </div>
          
          <div className="glass-panel p-5 border-sky-500/10 bg-sky-950/10 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">Đang thi công</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-sky-400">{ongoingProjects}</span>
              <span className="text-xs text-slate-400 font-bold">dự án</span>
            </div>
          </div>

          <div className="glass-panel p-5 border-emerald-500/10 bg-emerald-950/10 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Đã hoàn thành</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-400">{completedProjects}</span>
              <span className="text-xs text-slate-400 font-bold">dự án</span>
            </div>
          </div>

          <div className="glass-panel p-5 border-amber-500/10 bg-amber-950/10 flex flex-col justify-between">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Đang lập kế hoạch</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-400">{planningProjects}</span>
              <span className="text-xs text-slate-400 font-bold">dự án</span>
            </div>
          </div>
        </section>

        {/* Bố cục chia hai cột: Bảng dự án & Nhật ký gần đây */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Dự án nổi bật (2/3 chiều rộng) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-4 bg-sky-500 rounded-sm"></span> Dự án đang triển khai
              </h3>
              <Link href="/projects" className="text-xs font-bold text-sky-400 hover:underline">
                Xem tất cả &gt;
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="glass-panel glass-panel-hover p-6 border-slate-800/60 bg-slate-900/20 relative overflow-hidden">
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    {proj.status === "ongoing" && <span className="badge badge-info">Đang thi công</span>}
                    {proj.status === "completed" && <span className="badge badge-success">Đã hoàn thành</span>}
                    {proj.status === "planning" && <span className="badge badge-warning">Lập kế hoạch</span>}
                  </div>

                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{proj.code}</span>
                  <h4 className="text-base font-black text-white mt-1 leading-snug">{proj.name}</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{proj.description}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/40 text-xs text-slate-500 font-medium">
                    <div>
                      <span>📍 Địa điểm: </span>
                      <span className="text-slate-300 font-bold">{proj.location}</span>
                    </div>
                    <div>
                      <span>🤝 Đối tác: </span>
                      <span className="text-slate-300 font-bold">{proj.client}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-2">
                    <div className="text-[10px] font-bold text-slate-500">
                      Thời hạn: {proj.start_date} đến {proj.end_date}
                    </div>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-bold rounded-lg transition-all"
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
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-4 bg-teal-500 rounded-sm"></span> Nhật ký gần đây
            </h3>

            <div className="space-y-4">
              {diaries.length > 0 ? (
                diaries.map((diary) => {
                  const proj = projects.find((p) => p.id === diary.project_id);
                  return (
                    <div key={diary.id} className="glass-panel p-5 border-slate-800 bg-slate-900/10 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          📅 {diary.report_date}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">{diary.weather_temp}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-black text-white leading-none">
                          {proj ? proj.name : "Dự án Hydrotech"}
                        </h4>
                        <span className="text-[10px] text-slate-500 mt-1 block">Người lập: {diary.engineer_name}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-3 italic">
                        &quot;{diary.work_descriptions}&quot;
                      </p>

                      <div className="pt-2 border-t border-slate-800/40 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          📷 {diary.photos?.length || 0} Ảnh hiện trường
                        </span>
                        <Link
                          href={`/projects/${diary.project_id}?tab=diaries`}
                          className="text-xs font-bold text-sky-400 hover:underline"
                        >
                          Xem nhật ký
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-panel p-8 text-center text-xs text-slate-500">
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
