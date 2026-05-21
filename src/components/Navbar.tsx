"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { profile, tenant, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return { text: "Super Admin", class: "bg-red-500/20 text-red-400 border border-red-500/30" };
      case "tenant_admin":
        return { text: "Admin Doanh nghiệp", class: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" };
      case "pm":
        return { text: "Project Manager", class: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" };
      case "engineer":
        return { text: "Kỹ sư hiện trường", class: "bg-amber-500/20 text-amber-400 border border-amber-500/30" };
      case "inspector":
        return { text: "Giám sát / Chủ đầu tư", class: "bg-pink-500/20 text-pink-400 border border-pink-500/30" };
      default:
        return { text: "Thành viên", class: "bg-slate-500/20 text-slate-400" };
    }
  };

  const roleInfo = profile ? getRoleLabel(profile.role) : { text: "", class: "" };

  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between">
      {/* Brand & logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-500/10">
            H
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-white tracking-tight leading-none">HYDROTECH</h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mt-0.5">
              {tenant ? tenant.name : "PLATFORM"}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-1 sm:gap-4">
        <Link
          href="/dashboard"
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            pathname === "/dashboard"
              ? "text-sky-400 bg-sky-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Bảng tin
        </Link>
        <Link
          href="/projects"
          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            pathname.startsWith("/projects")
              ? "text-sky-400 bg-sky-500/10"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Dự án
        </Link>

        {/* Super admin & Tenant admin links */}
        {profile && (profile.role === "super_admin" || profile.role === "tenant_admin") && (
          <Link
            href={profile.role === "super_admin" ? "/admin/system" : "/admin/tenant"}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              pathname.startsWith("/admin")
                ? "text-sky-400 bg-sky-500/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Quản trị
          </Link>
        )}
      </div>

      {/* User profile & actions */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-white leading-none">
            {profile ? profile.full_name : "Kỹ sư"}
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${roleInfo.class}`}>
            {roleInfo.text}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-lg transition-all"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
