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
        return { text: "Super Admin", class: "bg-rose-100 text-rose-700 border-rose-200" };
      case "tenant_admin":
        return { text: "Admin Doanh nghiệp", class: "bg-emerald-100 text-emerald-700 border-emerald-200" };
      case "pm":
        return { text: "Project Manager", class: "bg-indigo-100 text-indigo-700 border-indigo-200" };
      case "engineer":
        return { text: "Kỹ sư hiện trường", class: "bg-amber-100 text-amber-700 border-amber-200" };
      case "inspector":
        return { text: "Giám sát / CĐT", class: "bg-pink-100 text-pink-700 border-pink-200" };
      default:
        return { text: "Thành viên", class: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  const roleInfo = profile ? getRoleLabel(profile.role) : { text: "", class: "" };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Brand & logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Hydrotech Logo" className="h-8 w-auto object-contain" onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }} />
          <div className="hidden w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-md shadow-sky-500/10">
            H
          </div>
          <div className="hidden sm:block border-l border-slate-300 pl-3 ml-1">
            <h1 className="text-sm font-black text-slate-800 tracking-tight leading-none">HYDROTECH</h1>
            <p className="text-[10px] text-sky-600 font-bold uppercase tracking-wider mt-0.5">
              {tenant ? tenant.name : "PLATFORM"}
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/dashboard"
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            pathname === "/dashboard"
              ? "text-sky-700 bg-sky-50"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          Bảng tin
        </Link>
        <Link
          href="/projects"
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            pathname.startsWith("/projects")
              ? "text-sky-700 bg-sky-50"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          Dự án
        </Link>

        {/* Super admin & Tenant admin links */}
        {profile && (profile.role === "super_admin" || profile.role === "tenant_admin") && (
          <Link
            href={profile.role === "super_admin" ? "/admin/system" : "/admin/tenant"}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              pathname.startsWith("/admin")
                ? "text-sky-700 bg-sky-50"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            Quản trị
          </Link>
        )}
      </div>

      {/* User profile & actions */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-slate-800 leading-none">
            {profile ? profile.full_name : "Kỹ sư"}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 ${roleInfo.class}`}>
            {roleInfo.text}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className="p-2 sm:px-4 sm:py-2 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
        >
          Đăng xuất
        </button>
      </div>
    </nav>
  );
}
