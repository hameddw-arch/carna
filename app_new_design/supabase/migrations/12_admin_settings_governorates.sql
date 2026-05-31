-- Create governorates table
CREATE TABLE IF NOT EXISTS public.governorates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default governorates (Syrian governorates)
INSERT INTO public.governorates (name, is_active) VALUES
  ('دمشق', true),
  ('ريف دمشق', true),
  ('حلب', true),
  ('حمص', true),
  ('حماة', true),
  ('اللاذقية', true),
  ('طرطوس', true),
  ('إدلب', true),
  ('درعا', true),
  ('السويداء', true),
  ('القنيطرة', true),
  ('دير الزور', true),
  ('الرقة', true),
  ('الحسكة', true)
ON CONFLICT (name) DO NOTHING;

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('site_maintenance', 'false', 'تفعيل وضع الصيانة (إغلاق الموقع مؤقتاً)'),
  ('allow_registrations', 'true', 'السماح بتسجيل مستخدمين جدد'),
  ('free_ads_limit', '3', 'عدد الإعلانات المجانية المسموح بها لكل مستخدم'),
  ('premium_ad_price', '50000', 'سعر الباقة المميزة للإعلان الواحد (بالليرة السورية)')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies for governorates
-- 1: Anyone can read active governorates
CREATE POLICY "Anyone can view active governorates" ON public.governorates
  FOR SELECT USING (is_active = true);

-- 2: Admins can do everything
CREATE POLICY "Admins can manage governorates" ON public.governorates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND is_admin = true)
  );

-- Policies for system_settings
-- 1: Anyone can read settings
CREATE POLICY "Anyone can view system settings" ON public.system_settings
  FOR SELECT USING (true);

-- 2: Admins can update settings
CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND is_admin = true)
  );
