"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getProjectById,
  getTasks,
  getDiaries,
  saveTask,
  Project,
  Task,
  ConstructionDiary
} from "@/lib/mockData";
import Link from "next/link";

export default function ProjectDetail() {
  const { user, profile, loading } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [diaries, setDiaries] = useState<ConstructionDiary[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "timeline" | "diaries">("info");
  
  // Trạng thái cho in ấn
  const [selectedDiaryToPrint, setSelectedDiaryToPrint] = useState<ConstructionDiary | null>(null);

  // Sync tab with search param if any
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "timeline" || tabParam === "diaries") {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && projectId) {
      const proj = getProjectById(projectId);
      if (proj) {
        setProject(proj);
        setTasks(getTasks(projectId));
        setDiaries(getDiaries(projectId));
      } else {
        router.push("/projects");
      }
    }
  }, [user, projectId, router]);

  // Cập nhật nhanh phần trăm tiến độ của task
  const handleUpdateProgress = (taskId: string, increment: number) => {
    if (profile?.role === "inspector") return; // Giám sát chỉ được xem

    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        let newProgress = t.progress + increment;
        if (newProgress > 100) newProgress = 100;
        if (newProgress < 0) newProgress = 0;
        
        const updatedTask = {
          ...t,
          progress: newProgress,
          status: newProgress === 100 ? "completed" as const : "active" as const,
        };
        
        saveTask(updatedTask);
        return updatedTask;
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const handlePrintDiary = (diary: ConstructionDiary) => {
    setSelectedDiaryToPrint(diary);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (loading || !user || !project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang tải chi tiết dự án...</p>
        </div>
      </div>
    );
  }

  // Thống kê tiến độ trung bình của dự án
  const avgProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length) 
    : 0;

  return (
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      <div className="radial-glow" style={{ top: "0%", left: "5%", opacity: 0.3 }}></div>


      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10 print-page">
        
        {/* Nút quay lại & Tiêu đề dự án */}
        <div className="no-print space-y-2">
          <Link href="/projects" className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1">
            &larr; Quay lại danh sách dự án
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest bg-sky-950/40 px-2 py-0.5 rounded">
                {project.code}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                {project.name}
              </h2>
            </div>
            
            {/* Tiến độ tổng hợp */}
            <div className="w-full md:w-64 bg-slate-900/50 p-4 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase">Tiến độ tổng hợp</span>
                <span className="text-sky-400">{avgProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="no-print flex border-b border-slate-800/80">
          {[
            { id: "info", label: "Thông tin chung" },
            { id: "timeline", label: "Tiến độ & Timeline" },
            { id: "diaries", label: "Nhật ký thi công" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-6 text-sm font-semibold transition-all relative ${
                activeTab === tab.id
                  ? "text-sky-400 font-bold border-b-2 border-sky-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: THÔNG TIN CHUNG */}
        {activeTab === "info" && (
          <section className="no-print grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 border-slate-800 bg-slate-900/10 space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Mô tả chi tiết</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              <div className="glass-panel p-6 border-slate-800 bg-slate-900/10 space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Thông tin phối hợp hiện trường</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0b101c] p-4 border border-slate-800/50 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Chủ đầu tư / Khách hàng</span>
                    <p className="text-white font-bold">{project.client}</p>
                  </div>
                  
                  <div className="bg-[#0b101c] p-4 border border-slate-800/50 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Địa điểm thi công</span>
                    <p className="text-white font-bold">{project.location}</p>
                  </div>

                  <div className="bg-[#0b101c] p-4 border border-slate-800/50 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Thời gian bắt đầu</span>
                    <p className="text-white font-bold">{project.start_date}</p>
                  </div>

                  <div className="bg-[#0b101c] p-4 border border-slate-800/50 rounded-xl space-y-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Dự kiến hoàn thành</span>
                    <p className="text-white font-bold">{project.end_date}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 border-slate-800 bg-slate-900/10 space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Thành viên Ban điều hành</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 text-xs">
                    <div>
                      <p className="font-bold text-white">Lê Thanh Sơn</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Chỉ huy trưởng / PM</span>
                    </div>
                    <span className="badge badge-info">Quản lý</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 text-xs">
                    <div>
                      <p className="font-bold text-white">Phạm Quốc Việt</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Kỹ sư trưởng Công trường</span>
                    </div>
                    <span className="badge badge-warning">Kỹ sư chính</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 text-xs">
                    <div>
                      <p className="font-bold text-white">Vũ Hữu Phước</p>
                      <span className="text-[10px] text-slate-500 font-semibold">Tư vấn Giám sát</span>
                    </div>
                    <span className="badge badge-success">Chủ đầu tư</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: TIẾN ĐỘ & TIMELINE */}
        {activeTab === "timeline" && (
          <section className="no-print glass-panel p-6 border-slate-800 bg-slate-900/10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Bảng Tiến độ thi công lắp đặt</h3>
              <span className="text-xs text-slate-500 font-bold">Chạm để cập nhật tiến độ công trường</span>
            </div>

            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">{task.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        🗓️ Thời hạn: {task.start_date} ~ {task.end_date} | Phụ trách: {task.assigned_to || "Chưa giao"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-400">{task.progress}%</span>
                      {task.status === "completed" ? (
                        <span className="badge badge-success">Hoàn thành</span>
                      ) : (
                        <span className="badge badge-info">Đang chạy</span>
                      )}
                    </div>
                  </div>

                  {/* Tiến độ thanh khối */}
                  <div className="gantt-progress-bar">
                    <div className="gantt-progress-fill" style={{ width: `${task.progress}%` }}></div>
                  </div>

                  {/* Các nút bấm chạm nhanh cập nhật % tiến độ cho Kỹ sư */}
                  {profile?.role !== "inspector" && (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdateProgress(task.id, -10)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold rounded text-slate-400"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(task.id, 10)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold rounded text-sky-400"
                      >
                        +10%
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(task.id, 25)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold rounded text-emerald-400"
                      >
                        +25%
                      </button>
                      <button
                        onClick={() => handleUpdateProgress(task.id, 100)}
                        className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-[10px] font-black rounded text-sky-300"
                      >
                        Hoàn thành
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: NHẬT KÝ THI CÔNG */}
        {activeTab === "diaries" && (
          <section className="no-print space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                📂 Nhật ký thi công lưu trữ
              </h3>
              
              {profile?.role === "engineer" && (
                <Link
                  href={`/projects/${projectId}/diaries/new`}
                  className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold"
                >
                  📝 Viết Nhật ký thi công hôm nay
                </Link>
              )}
            </div>

            <div className="space-y-4">
              {diaries.length > 0 ? (
                diaries.map((diary) => (
                  <div key={diary.id} className="glass-panel p-6 border-slate-800 bg-slate-900/10 space-y-4">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <span className="text-sm font-black text-white">📅 Ngày ghi nhận: {diary.report_date}</span>
                        <p className="text-[10px] text-slate-500 mt-0.5">Kỹ sư lập: {diary.engineer_name}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePrintDiary(diary)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 text-xs font-bold text-sky-400 rounded-lg transition-all"
                        >
                          🖨️ In / Xuất PDF
                        </button>
                      </div>
                    </div>

                    {/* Khối Thông tin chi tiết nhật ký */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/20 p-4 border border-slate-900 rounded-xl text-xs">
                      <div>
                        <span className="text-slate-500 font-bold">🌡️ Thời tiết: </span>
                        <span className="text-slate-300 font-bold">{diary.weather_status} ({diary.weather_temp})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">👷 Nhân lực hiện trường: </span>
                        <p className="text-slate-300 font-medium mt-1 whitespace-pre-line">{diary.manpower_details}</p>
                      </div>
                      <div className="md:col-span-2 border-t border-slate-900 pt-2 mt-2">
                        <span className="text-slate-500 font-bold">⚙️ Thiết bị hoạt động: </span>
                        <p className="text-slate-300 font-medium mt-1 whitespace-pre-line">{diary.machinery_details}</p>
                      </div>
                      <div className="md:col-span-2 border-t border-slate-900 pt-2 mt-2">
                        <span className="text-slate-500 font-bold">📝 Công tác thi công chi tiết: </span>
                        <p className="text-slate-300 font-medium mt-1 leading-relaxed whitespace-pre-line">{diary.work_descriptions}</p>
                      </div>
                      
                      {diary.inspections && (
                        <div className="md:col-span-2 border-t border-slate-900 pt-2 mt-2">
                          <span className="text-emerald-500 font-bold">✅ Công tác nghiệm thu kỹ thuật: </span>
                          <p className="text-slate-300 font-medium mt-1 whitespace-pre-line">{diary.inspections}</p>
                        </div>
                      )}

                      {diary.safety_issues && (
                        <div className="md:col-span-2 border-t border-slate-900 pt-2 mt-2">
                          <span className="text-rose-500 font-bold">⚠️ An toàn & Sự cố phát sinh: </span>
                          <p className="text-slate-300 font-medium mt-1 whitespace-pre-line">{diary.safety_issues}</p>
                        </div>
                      )}
                    </div>

                    {/* Hình ảnh đính kèm hiện trường */}
                    {diary.photos && diary.photos.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Hình ảnh hiện trường thực tế:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {diary.photos.map((ph, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex flex-col">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ph.url}
                                alt={ph.caption}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-[10px] text-slate-300 truncate font-semibold">
                                {ph.caption}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="glass-panel p-16 text-center text-slate-500 text-sm">
                  Chưa có nhật ký nào được ghi nhận cho dự án này.
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* -------------------------------------------------------------
         BẢN IN PDF NHẬT KÝ THI CÔNG CHUẨN VIỆT NAM (Nghị định 06/2021/NĐ-CP)
         Chỉ xuất hiện khi kích hoạt tính năng Print (In ẩn)
         ------------------------------------------------------------- */}
      {selectedDiaryToPrint && (
        <div className="hidden print:block print-page">
          <div className="print-header">
            <div className="font-bold text-[14px] uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold text-[13px] underline">Độc lập - Tự do - Hạnh phúc</div>
            <div className="mt-6 font-bold text-[14px] uppercase">CÔNG TY CỔ PHẦN CÔNG NGHỆ HYDROTECH</div>
            <div className="print-title">
              NHẬT KÝ THI CÔNG LẮP ĐẶT & CƠ ĐIỆN HÀNG NGÀY
            </div>
            <div className="text-[13px] italic font-semibold">
              Ngày ghi nhật ký: {selectedDiaryToPrint.report_date}
            </div>
          </div>

          <table className="print-table">
            <tbody>
              <tr>
                <td className="w-1/3 font-bold">1. Tên Dự án / Gói thầu</td>
                <td>{project.name} ({project.code})</td>
              </tr>
              <tr>
                <td className="font-bold">2. Địa điểm xây dựng</td>
                <td>{project.location}</td>
              </tr>
              <tr>
                <td className="font-bold">3. Chủ đầu tư / Khách hàng</td>
                <td>{project.client}</td>
              </tr>
              <tr>
                <td className="font-bold">4. Kỹ sư chịu trách nhiệm ghi</td>
                <td>{selectedDiaryToPrint.engineer_name}</td>
              </tr>
              <tr>
                <td className="font-bold">5. Tình hình thời tiết</td>
                <td>Nhiệt độ: {selectedDiaryToPrint.weather_temp} | Trạng thái: {selectedDiaryToPrint.weather_status}</td>
              </tr>
            </tbody>
          </table>

          <table className="print-table">
            <thead>
              <tr>
                <th className="w-1/4">Hạng mục khảo sát</th>
                <th>Nội dung chi tiết ghi nhận hiện trường</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">Nhân lực thi công</td>
                <td className="whitespace-pre-line">{selectedDiaryToPrint.manpower_details}</td>
              </tr>
              <tr>
                <td className="font-bold">Thiết bị, máy móc hoạt động</td>
                <td className="whitespace-pre-line">{selectedDiaryToPrint.machinery_details}</td>
              </tr>
              <tr>
                <td className="font-bold">Nội dung công việc thi công chi tiết</td>
                <td className="whitespace-pre-line leading-relaxed">{selectedDiaryToPrint.work_descriptions}</td>
              </tr>
              <tr>
                <td className="font-bold">Công tác nghiệm thu (nếu có)</td>
                <td className="whitespace-pre-line">{selectedDiaryToPrint.inspections || "Không có nội dung nghiệm thu"}</td>
              </tr>
              <tr>
                <td className="font-bold">An toàn, vệ sinh & Phát sinh sự cố</td>
                <td className="whitespace-pre-line">{selectedDiaryToPrint.safety_issues || "Đảm bảo an toàn lao động, không có phát sinh sự cố"}</td>
              </tr>
            </tbody>
          </table>

          <div className="sign-section">
            <div className="sign-col">
              <p className="font-bold">KỸ SƯ GIÁM SÁT CỦA CHỦ ĐẦU TƯ</p>
              <p className="italic text-xs">(Ký và ghi rõ họ tên)</p>
              <div className="h-20"></div>
              <p className="font-bold">{project.client ? `Đại diện ${project.client}` : "............................"}</p>
            </div>
            
            <div className="sign-col">
              <p className="font-bold">KỸ SƯ THI CÔNG HYDROTECH</p>
              <p className="italic text-xs">(Ký và ghi rõ họ tên)</p>
              <div className="h-20"></div>
              <p className="font-bold">{selectedDiaryToPrint.engineer_name}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
