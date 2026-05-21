"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { getProjects, saveProject, Project } from "@/lib/mockData";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Projects() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [newProjName, setNewProjName] = useState("");
  const [newProjCode, setNewProjCode] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjClient, setNewProjClient] = useState("");
  const [newProjStart, setNewProjStart] = useState("");
  const [newProjEnd, setNewProjEnd] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<"planning" | "ongoing" | "completed">("planning");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setProjects(getProjects());
    }
  }, [user]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: "proj-" + Date.now(),
      name: newProjName,
      code: newProjCode,
      location: newProjLocation,
      client: newProjClient,
      start_date: newProjStart || new Date().toISOString().split("T")[0],
      end_date: newProjEnd || new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString().split("T")[0],
      status: newProjStatus,
      description: newProjDesc,
    };

    saveProject(newProject);
    setProjects(getProjects()); // Refresh list
    
    // Clear form & close modal
    setNewProjName("");
    setNewProjCode("");
    setNewProjLocation("");
    setNewProjClient("");
    setNewProjStart("");
    setNewProjEnd("");
    setNewProjDesc("");
    setNewProjStatus("planning");
    setShowCreateModal(false);
  };

  if (loading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang tải danh sách dự án...</p>
        </div>
      </div>
    );
  }

  // Lọc dự án theo tìm kiếm và trạng thái
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || proj.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canCreateProject = profile?.role === "super_admin" || profile?.role === "tenant_admin" || profile?.role === "pm";

  return (
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      <div className="radial-glow" style={{ top: "0%", right: "10%", opacity: 0.4 }}></div>
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Tiêu đề & Nút Tạo mới */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Danh sách Dự án
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Quản lý các hạng mục thi công cơ điện và xây lắp của Hydrotech.
            </p>
          </div>

          {canCreateProject && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-5 py-3 rounded-xl text-sm font-semibold self-start sm:self-center"
            >
              ➕ Khởi tạo Dự án Mới
            </button>
          )}
        </div>

        {/* Thanh tìm kiếm & Bộ lọc trạng thái */}
        <div className="glass-panel p-4 border-slate-800 bg-slate-900/10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên dự án, mã dự án, chủ đầu tư..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-md px-4 py-2.5 bg-[#0a0f1d] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors text-xs sm:text-sm"
          />

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {[
              { id: "all", label: "Tất cả" },
              { id: "planning", label: "Lập kế hoạch" },
              { id: "ongoing", label: "Đang thi công" },
              { id: "completed", label: "Đã hoàn thành" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                    : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lưới dự án */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel glass-panel-hover p-6 border-slate-800/80 bg-slate-900/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest bg-sky-950/40 px-2 py-0.5 rounded">
                      {proj.code}
                    </span>
                    <div>
                      {proj.status === "ongoing" && <span className="badge badge-info">Đang thi công</span>}
                      {proj.status === "completed" && <span className="badge badge-success">Đã hoàn thành</span>}
                      {proj.status === "planning" && <span className="badge badge-warning">Lập kế hoạch</span>}
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white leading-snug line-clamp-2">{proj.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">{proj.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/40 space-y-4">
                  <div className="space-y-1 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>📍 Địa chỉ: </span>
                      <span className="text-slate-300 truncate">{proj.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🤝 Đối tác: </span>
                      <span className="text-slate-300 truncate">{proj.client}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {proj.start_date} ~ {proj.end_date}
                    </span>
                    <Link
                      href={`/projects/${proj.id}`}
                      className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-bold rounded-lg transition-all"
                    >
                      Vào Dự án &gt;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-16 text-center text-slate-500 text-sm">
            Không tìm thấy dự án nào khớp với bộ lọc của bạn.
          </div>
        )}

        {/* MODAL KHỞI TẠO DỰ ÁN MỚI */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg glass-panel p-6 bg-[#0c1222] border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-white uppercase tracking-wider">Khởi tạo Dự án mới</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-500 hover:text-slate-300 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mã Dự án</label>
                    <input
                      type="text"
                      required
                      placeholder="HT-2026-XYZ"
                      value={newProjCode}
                      onChange={(e) => setNewProjCode(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Trạng thái</label>
                    <select
                      value={newProjStatus}
                      onChange={(e) => setNewProjStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="planning">Lập kế hoạch</option>
                      <option value="ongoing">Đang thi công</option>
                      <option value="completed">Đã hoàn thành</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tên Dự án</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập tên dự án đầy đủ..."
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Ngày bắt đầu</label>
                    <input
                      type="date"
                      value={newProjStart}
                      onChange={(e) => setNewProjStart(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={newProjEnd}
                      onChange={(e) => setNewProjEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Địa điểm thi công</label>
                  <input
                    type="text"
                    placeholder="Địa chỉ cụ thể công trường..."
                    value={newProjLocation}
                    onChange={(e) => setNewProjLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Chủ đầu tư / Đối tác</label>
                  <input
                    type="text"
                    placeholder="Tên công ty đối tác hoặc chủ đầu tư..."
                    value={newProjClient}
                    onChange={(e) => setNewProjClient(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Mô tả chi tiết dự án</label>
                  <textarea
                    rows={3}
                    placeholder="Nhập thông tin giới thiệu dự án, phạm vi thi công..."
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary px-4 py-2 text-xs"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Khởi tạo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
