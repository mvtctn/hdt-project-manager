"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: "pm" | "engineer" | "inspector";
  status: "active" | "inactive";
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: "mock-pm-uuid",
    full_name: "Lê Thanh Sơn",
    email: "pm@hydrotech.vn",
    phone: "0912345678",
    role: "pm",
    status: "active",
  },
  {
    id: "mock-engineer-uuid",
    full_name: "Phạm Quốc Việt",
    email: "engineer@hydrotech.vn",
    phone: "0987654321",
    role: "engineer",
    status: "active",
  },
  {
    id: "mock-inspector-uuid",
    full_name: "Vũ Hữu Phước",
    email: "inspector@hydrotech.vn",
    phone: "0909090909",
    role: "inspector",
    status: "active",
  },
];

export default function TenantAdminPortal() {
  const { user, profile, tenant, loading } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"pm" | "engineer" | "inspector">("engineer");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (profile?.role !== "tenant_admin" && profile?.role !== "super_admin") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem("tenant_members");
      if (stored) {
        setMembers(JSON.parse(stored));
      } else {
        localStorage.setItem("tenant_members", JSON.stringify(INITIAL_MEMBERS));
        setMembers(INITIAL_MEMBERS);
      }
    }
  }, [user]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const newMember: Member = {
      id: "member-" + Date.now(),
      full_name: fullName,
      email,
      phone,
      role,
      status: "active",
    };

    const updated = [...members, newMember];
    localStorage.setItem("tenant_members", JSON.stringify(updated));
    setMembers(updated);

    setFullName("");
    setEmail("");
    setPhone("");
    setRole("engineer");
  };

  const handleToggleStatus = (id: string) => {
    const updated = members.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status: m.status === "active" ? ("inactive" as const) : ("active" as const),
        };
      }
      return m;
    });
    localStorage.setItem("tenant_members", JSON.stringify(updated));
    setMembers(updated);
  };

  if (loading || !user || (profile?.role !== "tenant_admin" && profile?.role !== "super_admin")) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang kết nối cổng Quản trị doanh nghiệp...</p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (r: string) => {
    switch (r) {
      case "pm":
        return <span className="badge badge-info">Project Manager</span>;
      case "engineer":
        return <span className="badge badge-warning">Kỹ sư hiện trường</span>;
      case "inspector":
        return <span className="badge badge-success">Giám sát / Chủ đầu tư</span>;
      default:
        return <span className="badge">Nhân sự</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      <div className="radial-glow" style={{ top: "0%", right: "10%", opacity: 0.4 }}></div>
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Tiêu đề */}
        <div>
          <span className="badge badge-info">Quản trị Doanh nghiệp</span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 uppercase tracking-tight">
            Quản trị nội bộ: {tenant?.name || "Hydrotech"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý đội ngũ nhân viên kỹ sư công trường, chỉ huy trưởng PM và phân quyền tham gia dự án.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thêm nhân sự mới */}
          <div className="space-y-6">
            <div className="glass-panel p-6 bg-slate-900/20 border-slate-850 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Thêm Nhân sự mới</h3>
              
              <form onSubmit={handleAddMember} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Họ và Tên</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập họ và tên đầy đủ..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Email làm việc</label>
                  <input
                    type="email"
                    required
                    placeholder="name@hydrotech.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="Số di động liên hệ công trường..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Vai trò hệ thống</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="engineer">Kỹ sư hiện trường (Engineer)</option>
                    <option value="pm">Chỉ huy trưởng / PM (Manager)</option>
                    <option value="inspector">Giám sát chủ đầu tư (Client/Inspector)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 rounded-lg text-xs"
                >
                  🚀 Thêm & Gửi thư mời tham gia
                </button>
              </form>
            </div>
          </div>

          {/* Cột phải: Danh sách nhân sự */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 bg-slate-900/10 border-slate-850 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Danh sách nhân viên</h3>
              
              <div className="space-y-4">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 bg-[#0a0f1e] border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">{m.full_name}</span>
                        {m.status === "active" ? (
                          <span className="badge badge-success">Đang hoạt động</span>
                        ) : (
                          <span className="badge badge-danger">Đã khóa</span>
                        )}
                      </div>
                      <p className="text-slate-500 font-medium">
                        Email: <span className="text-sky-400">{m.email}</span> {m.phone && `| SĐT: ${m.phone}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>{getRoleBadge(m.role)}</div>
                      <button
                        onClick={() => handleToggleStatus(m.id)}
                        className={`px-3 py-1.5 rounded font-bold text-xs transition-all ${
                          m.status === "active"
                            ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {m.status === "active" ? "Khóa nhân viên" : "Mở khóa"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
