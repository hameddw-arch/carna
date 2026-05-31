-- Add analytics columns to services table
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS whatsapp_clicks INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0;

-- Create service_images table
CREATE TABLE IF NOT EXISTS public.service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on service_images
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;

-- Policies for service_images
-- Anyone can view service images
CREATE POLICY "Service images are viewable by everyone"
  ON public.service_images FOR SELECT
  USING (true);

-- Only authenticated owners can insert images for their services
CREATE POLICY "Owners can insert images for their services"
  ON public.service_images FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.services WHERE id = service_id
    )
  );

-- Only authenticated owners can delete images for their services
CREATE POLICY "Owners can delete images for their services"
  ON public.service_images FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.services WHERE id = service_id
    )
  );

-- Only authenticated owners can update images for their services
CREATE POLICY "Owners can update images for their services"
  ON public.service_images FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.services WHERE id = service_id
    )
  );
