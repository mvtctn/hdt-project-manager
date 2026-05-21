"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isConfigured } from "@/lib/supabase";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: "super_admin" | "tenant_admin" | "pm" | "engineer" | "inspector";
  status: "active" | "inactive";
}

interface AuthContextType {
  user: any;
  profile: Profile | null;
  tenant: Tenant | null;
  loading: boolean;
  isMock: boolean;
  signOut: () => Promise<void>;
  signInWithMock: (email: string, role: string) => void;
  updateMockProfile: (name: string, phone: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  tenant: null,
  loading: true,
  isMock: false,
  signOut: async () => {},
  signInWithMock: () => {},
  updateMockProfile: () => {},
});

// Mock profiles for testing when Supabase keys are not set
const MOCK_TENANT: Tenant = {
  id: "7b4e9bdf-87cc-44fe-8822-1262ab0c1bf6",
  name: "Công ty Hydrotech",
  slug: "hydrotech",
  plan: "enterprise",
  status: "active",
};

const MOCK_PROFILES: Record<string, Profile> = {
  "info@hydrotech.vn": {
    id: "mock-main-admin-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "info@hydrotech.vn",
    full_name: "Admin Hydrotech",
    role: "super_admin",
    status: "active",
  },
  "superadmin@hydrotech.vn": {
    id: "mock-super-admin-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "superadmin@hydrotech.vn",
    full_name: "Nguyễn Văn Trưởng (Super Admin)",
    role: "super_admin",
    status: "active",
  },
  "admin@hydrotech.vn": {
    id: "mock-admin-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "admin@hydrotech.vn",
    full_name: "Trần Minh Hoàng (Admin Hydrotech)",
    role: "tenant_admin",
    status: "active",
  },
  "pm@hydrotech.vn": {
    id: "mock-pm-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "pm@hydrotech.vn",
    full_name: "Lê Thanh Sơn (PM Điện Nước)",
    role: "pm",
    status: "active",
  },
  "engineer@hydrotech.vn": {
    id: "mock-engineer-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "engineer@hydrotech.vn",
    full_name: "Phạm Quốc Việt (Kỹ sư Công trường)",
    role: "engineer",
    status: "active",
  },
  "inspector@hydrotech.vn": {
    id: "mock-inspector-uuid",
    tenant_id: MOCK_TENANT.id,
    email: "inspector@hydrotech.vn",
    full_name: "Vũ Hữu Phước (Tư vấn Giám sát)",
    role: "inspector",
    status: "active",
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(!isConfigured);

  // Sync Supabase authentication state
  useEffect(() => {
    if (!isConfigured) {
      // Dùng Mock Session mặc định để bắt đầu trải nghiệm lập tức
      const cachedMock = localStorage.getItem("mock_session");
      if (cachedMock) {
        const mockUser = JSON.parse(cachedMock);
        setUser(mockUser);
        setProfile(MOCK_PROFILES[mockUser.email] || MOCK_PROFILES["engineer@hydrotech.vn"]);
        setTenant(MOCK_TENANT);
      }
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          
          // Lấy profile từ database công ty
          const { data: profileData, error: profileErr } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData as Profile);
            
            // Lấy tenant của profile này
            const { data: tenantData } = await supabase
              .from("tenants")
              .select("*")
              .eq("id", profileData.tenant_id)
              .single();
              
            if (tenantData) {
              setTenant(tenantData as Tenant);
            }
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Lắng nghe sự kiện đăng nhập/đăng xuất
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
          setLoading(true);
          
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData as Profile);
            const { data: tenantData } = await supabase
              .from("tenants")
              .select("*")
              .eq("id", profileData.tenant_id)
              .single();
            if (tenantData) {
              setTenant(tenantData as Tenant);
            }
          }
          setLoading(false);
        } else {
          setUser(null);
          setProfile(null);
          setTenant(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Xử lý đăng xuất
  const signOut = async () => {
    if (isMock) {
      localStorage.removeItem("mock_session");
      setUser(null);
      setProfile(null);
      setTenant(null);
      return;
    }
    await supabase.auth.signOut();
  };

  // Đăng nhập nhanh bằng tài khoản Mock phục vụ chạy thử & phát triển
  const signInWithMock = (email: string, role: string) => {
    setIsMock(true);
    const selectedProfile = Object.values(MOCK_PROFILES).find(
      (p) => p.email === email || ((p.role as string) === role && role !== "")
    ) || MOCK_PROFILES["engineer@hydrotech.vn"];

    const mockUser = {
      id: selectedProfile.id,
      email: selectedProfile.email,
      user_metadata: { full_name: selectedProfile.full_name },
    };

    localStorage.setItem("mock_session", JSON.stringify(mockUser));
    setUser(mockUser);
    setProfile(selectedProfile);
    setTenant(MOCK_TENANT);
  };

  const updateMockProfile = (name: string, phone: string) => {
    if (profile) {
      const updated = { ...profile, full_name: name, phone };
      setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        tenant,
        loading,
        isMock,
        signOut,
        signInWithMock,
        updateMockProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
