"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TenantData {
  id: string;
  name: string;
  slug: string;
  plan: "basic" | "pro" | "enterprise";
  status: "active" | "suspended";
  created_at: string;
}

const INITIAL_TENANTS: TenantData[] = [
  {
    id: "7b4e9bdf-87cc-44fe-8822-1262ab0c1bf6",
    name: "Công ty Cổ phần Hydrotech",
    slug: "hydrotech",
    plan: "enterprise",
    status: "active",
    created_at: "2026-04-01",
  },
  {
    id: "tenant-2",
    name: "Cơ điện & Lắp máy VibeTech",
    slug: "vibetech",
    plan: "pro",
    status: "active",
    created_at: "2026-05-10",
  },
  {
    id: "tenant-3",
    name: "Tổng công ty Xây lắp Minh Khang",
    slug: "minhkhang",
    plan: "basic",
    status: "suspended",
    created_at: "2026-03-15",
  },
];

export default function SuperAdminPortal() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [tenants, setTenants] = useState<TenantData[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [plan, setPlan] = useState<"basic" | "pro" | "enterprise">("basic");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (profile?.role !== "super_admin") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (user) {
      // Sync from localstorage or use default
      const stored = localStorage.getItem("saas_tenants");
      if (stored) {
        setTenants(JSON.parse(stored));
      } else {
        localStorage.setItem("saas_tenants", JSON.stringify(INITIAL_TENANTS));
        setTenants(INITIAL_TENANTS);
      }
    }
  }, [user]);

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    const newTenant: TenantData = {
      id: "tenant-" + Date.now(),
      name,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      plan,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
    };

    const updated = [...tenants, newTenant];
    localStorage.setItem("saas_tenants", JSON.stringify(updated));
    setTenants(updated);
    
    setName("");
    setSlug("");
    setPlan("basic");
  };

  const handleToggleStatus = (id: string) => {
    const updated = tenants.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === "active" ? ("suspended" as const) : ("active" as const),
        };
      }
      return t;
    });
    localStorage.setItem("saas_tenants", JSON.stringify(updated));
    setTenants(updated);
  };

  const handleChangePlan = (id: string, newPlan: any) => {
    const updated = tenants.map((t) => {
      if (t.id === id) {
        return { ...t, plan: newPlan };
      }
      return t;
    });
    localStorage.setItem("saas_tenants", JSON.stringify(updated));
    setTenants(updated);
  };

  if (loading || !user || profile?.role !== "super_admin") {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#090e1a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Đang mở cổng quản trị Super Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#050811] min-h-screen text-slate-100 relative">
      <div className="radial-glow" style={{ top: "0%", left: "10%", opacity: 0.4 }}></div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        
        {/* Banner */}
        <div>
          <span className="badge badge-danger">Hệ thống SaaS</span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 uppercase tracking-tight">
            Super Admin Control Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cổng quản lý và cấp phép tính năng dành cho quản trị viên tối cao của Nền tảng Hydrotech.
          </p>
        </div>

        {/* Khối Thống kê SaaS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-5 bg-slate-900/10 border-slate-800">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Tổng Doanh nghiệp (Tenants)</span>
            <h3 className="text-3xl font-black text-white mt-1">{tenants.length}</h3>
          </div>
          <div className="glass-panel p-5 bg-slate-900/10 border-sky-500/10">
            <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">Doanh nghiệp đang chạy</span>
            <h3 className="text-3xl font-black text-sky-400 mt-1">{tenants.filter(t => t.status === "active").length}</h3>
          </div>
          <div className="glass-panel p-5 bg-slate-900/10 border-rose-500/10">
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Doanh nghiệp Tạm ngưng</span>
            <h3 className="text-3xl font-black text-rose-400 mt-1">{tenants.filter(t => t.status === "suspended").length}</h3>
          </div>
        </section>

        {/* Cột chính chia hai: Tạo mới và danh sách */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Cấp phép Tenant mới */}
          <div className="space-y-6">
            <div className="glass-panel p-6 bg-slate-900/20 border-slate-850 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Cấp phép Doanh nghiệp Mới</h3>
              
              <form onSubmit={handleCreateTenant} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Tên doanh nghiệp</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lắp máy Điện lạnh Sài Gòn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Định danh Slug (URL Subdomain)</label>
                  <input
                    type="text"
                    required
                    placeholder="dienlanhsaigon"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Gói tính năng (Plan)</label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#060a14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="basic">Gói Cơ Bản (Basic)</option>
                    <option value="pro">Gói Chuyên Nghiệp (Pro)</option>
                    <option value="enterprise">Gói Doanh Nghiệp (Enterprise)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-2.5 rounded-lg text-xs"
                >
                  🚀 Cấp tài nguyên & Kích hoạt
                </button>
              </form>
            </div>
          </div>

          {/* Cột phải: Danh sách và quản lý các Tenant */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 bg-slate-900/10 border-slate-850 space-y-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider">Danh sách Doanh nghiệp trên Nền tảng</h3>
              
              <div className="space-y-4">
                {tenants.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-[#0a0f1e] border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">{t.name}</span>
                        {t.status === "active" ? (
                          <span className="badge badge-success">Đang chạy</span>
                        ) : (
                          <span className="badge badge-danger">Tạm khóa</span>
                        )}
                      </div>
                      <p className="text-slate-500 font-medium">
                        URL: <span className="text-sky-400 font-bold">{t.slug}.project.hydrotech.vn</span> | Ngày cấp: {t.created_at}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <select
                          value={t.plan}
                          onChange={(e) => handleChangePlan(t.id, e.target.value)}
                          className="px-2 py-1.5 bg-[#060a14] border border-slate-800 rounded text-xs text-white"
                        >
                          <option value="basic">Gói Basic</option>
                          <option value="pro">Gói Pro</option>
                          <option value="enterprise">Gói Enterprise</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleToggleStatus(t.id)}
                        className={`px-3 py-1.5 rounded font-bold text-xs transition-all ${
                          t.status === "active"
                            ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {t.status === "active" ? "Khóa doanh nghiệp" : "Mở khóa"}
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
