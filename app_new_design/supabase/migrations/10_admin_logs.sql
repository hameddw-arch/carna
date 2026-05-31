-- Create Admin Logs Table
CREATE TABLE public.admin_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  type TEXT NOT NULL, -- 'add', 'edit', 'delete'
  color TEXT NOT NULL, -- 'green', 'blue', 'red'
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read all logs
CREATE POLICY "Admins can view all logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- Admins can insert logs
CREATE POLICY "Admins can insert logs" ON public.admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );
