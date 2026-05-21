-- SUPABASE DATABASE SCHEMA SETUP
-- NỀN TẢNG SAAS QUẢN LÝ DỰ ÁN & NHẬT KÝ THI CÔNG
-- Hỗ trợ đa doanh nghiệp (Multi-tenant) & Phân quyền (RBAC)

-- 1. Kích hoạt tiện ích mở rộng UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tạo bảng TENANTS (Doanh nghiệp)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tạo bảng PROFILES (Hồ sơ người dùng)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'engineer' CHECK (role IN ('super_admin', 'tenant_admin', 'pm', 'engineer', 'inspector')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tạo bảng PROJECTS (Dự án)
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    location TEXT,
    client TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed', 'suspended')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (tenant_id, code)
);

-- 5. Tạo bảng PROJECT_MEMBERS (Thành viên dự án)
CREATE TABLE public.project_members (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_in_project TEXT NOT NULL DEFAULT 'Site_Engineer' CHECK (role_in_project IN ('PM', 'Supervisor', 'Site_Engineer')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (project_id, user_id)
);

-- 6. Tạo bảng TASKS (Tiến độ công việc)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    dependencies UUID[] DEFAULT '{}',
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tạo bảng CONSTRUCTION_DIARIES (Nhật ký thi công)
CREATE TABLE public.construction_diaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    engineer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    weather_temp TEXT, -- Nhiệt độ (oC), ví dụ: "28 - 32"
    weather_status TEXT, -- Nắng ráo, mưa rào, ẩm ướt...
    manpower_details TEXT, -- Chi tiết nhân lực: Tổ cơ điện 5 người, tổ lắp đặt 3 người...
    machinery_details TEXT, -- Thiết bị thi công: Máy hàn 2 chiếc, xe cẩu 1 chiếc...
    work_descriptions TEXT, -- Nội dung công việc thực hiện chi tiết (tích hợp Voice-to-Text)
    inspections TEXT, -- Các hạng mục nghiệm thu trong ngày
    safety_issues TEXT, -- Vấn đề an toàn lao động, sự cố phát sinh
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (project_id, report_date)
);

-- 8. Tạo bảng DIARY_PHOTOS (Hình ảnh đính kèm nhật ký)
CREATE TABLE public.diary_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID NOT NULL REFERENCES public.construction_diaries(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'progress' CHECK (category IN ('progress', 'material', 'incident')),
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tạo bảng DAILY_REPORTS (Báo cáo ngày tóm tắt)
CREATE TABLE public.daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diary_id UUID NOT NULL REFERENCES public.construction_diaries(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    reported_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TẠO INDEXES TỐI ƯU HÓA TRUY VẤN
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_projects_tenant ON public.projects(tenant_id);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_diaries_project ON public.construction_diaries(project_id);
CREATE INDEX idx_diaries_date ON public.construction_diaries(report_date);
CREATE INDEX idx_photos_diary ON public.diary_photos(diary_id);

-- 11. BẬT ROW LEVEL SECURITY (RLS) ĐỂ BẢO MẬT SAAS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

-- 12. CHÍNH SÁCH BẢO MẬT RLS (POLICIES) CÔ LẬP THEO TENANT
-- Lưu ý: Super Admin có quyền xem/sửa toàn bộ

-- Chính sách cho bảng TENANTS
CREATE POLICY "Super admin can do everything on tenants" 
    ON public.tenants FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'));

CREATE POLICY "Users can view their own tenant details" 
    ON public.tenants FOR SELECT TO authenticated 
    USING (id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- Chính sách cho bảng PROFILES
CREATE POLICY "Users can view profiles in the same tenant" 
    ON public.profiles FOR SELECT TO authenticated 
    USING (
        role = 'super_admin' OR 
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Tenant admin and super admin can modify profiles" 
    ON public.profiles FOR ALL TO authenticated 
    USING (
        role = 'super_admin' OR 
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'tenant_admin' AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Allow individual profile update" 
    ON public.profiles FOR UPDATE TO authenticated 
    USING (id = auth.uid()) 
    WITH CHECK (id = auth.uid());

-- Chính sách cho bảng PROJECTS
CREATE POLICY "Users can select projects in their tenant" 
    ON public.projects FOR SELECT TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins and PMs can modify projects in their tenant" 
    ON public.projects FOR ALL TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tenant_admin', 'pm') AND tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()))
    );

-- Chính sách cho bảng PROJECT_MEMBERS
CREATE POLICY "Users can select project members in their tenant" 
    ON public.project_members FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            JOIN public.profiles pr ON pr.id = auth.uid() 
            WHERE p.id = project_members.project_id AND (pr.role = 'super_admin' OR p.tenant_id = pr.tenant_id)
        )
    );

CREATE POLICY "Admins and PMs can manage project members" 
    ON public.project_members FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.projects p 
            JOIN public.profiles pr ON pr.id = auth.uid() 
            WHERE p.id = project_members.project_id AND (pr.role = 'super_admin' OR (pr.role IN ('tenant_admin', 'pm') AND p.tenant_id = pr.tenant_id))
        )
    );

-- Chính sách cho bảng TASKS
CREATE POLICY "Users can view tasks in their tenant" 
    ON public.tasks FOR SELECT TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Engineers, PMs, and Admins can update tasks" 
    ON public.tasks FOR ALL TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tenant_admin', 'pm', 'engineer'))
    );

-- Chính sách cho bảng CONSTRUCTION_DIARIES
CREATE POLICY "Users can view diaries in their tenant" 
    ON public.construction_diaries FOR SELECT TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Engineers, PMs and Admins can create/edit diaries in their tenant" 
    ON public.construction_diaries FOR ALL TO authenticated 
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin' OR 
        (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('tenant_admin', 'pm', 'engineer'))
    );

-- Chính sách cho bảng DIARY_PHOTOS
CREATE POLICY "Users can view diary photos in their tenant" 
    ON public.diary_photos FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.construction_diaries d 
            JOIN public.profiles pr ON pr.id = auth.uid() 
            WHERE d.id = diary_photos.diary_id AND (pr.role = 'super_admin' OR d.tenant_id = pr.tenant_id)
        )
    );

CREATE POLICY "Engineers and PMs can upload diary photos" 
    ON public.diary_photos FOR ALL TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM public.construction_diaries d 
            JOIN public.profiles pr ON pr.id = auth.uid() 
            WHERE d.id = diary_photos.diary_id AND (pr.role = 'super_admin' OR (pr.role IN ('tenant_admin', 'pm', 'engineer') AND d.tenant_id = pr.tenant_id))
        )
    );

-- 13. SEED DỮ LIỆU BAN ĐẦU - TENANT HYDROTECH & SUPER ADMIN MẪU
INSERT INTO public.tenants (id, name, slug, plan, status)
VALUES ('7b4e9bdf-87cc-44fe-8822-1262ab0c1bf6', 'Công ty Hydrotech', 'hydrotech', 'enterprise', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 14. TRIGGER TỰ ĐỘNG KHỞI TẠO PROFILE KHI SIGNUP
-- Trigger này sẽ chạy mỗi khi có user mới đăng ký qua Supabase Auth.
-- Tự động gán họ vào Tenant mặc định (Hydrotech) làm 'engineer' nếu không chỉ định tenant khác.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_tenant_id UUID;
BEGIN
    SELECT id INTO default_tenant_id FROM public.tenants WHERE slug = 'hydrotech' LIMIT 1;
    
    INSERT INTO public.profiles (id, tenant_id, email, full_name, role, status)
    VALUES (
        new.id,
        default_tenant_id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Kỹ sư mới'),
        COALESCE(new.raw_user_meta_data->>'role', 'engineer'),
        'active'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
