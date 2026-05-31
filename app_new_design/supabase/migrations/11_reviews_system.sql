-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  content TEXT NOT NULL,
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(service_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON public.reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can view reviews
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

-- Policy 2: Authenticated users can insert their own reviews
CREATE POLICY "Users can insert their own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: Owners can reply to reviews for their services
CREATE POLICY "Owners can update reviews to add replies" ON public.reviews
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.services WHERE id = service_id
    )
  );

-- Database Trigger to update average rating and reviews_count in services
CREATE OR REPLACE FUNCTION public.update_service_rating()
RETURNS trigger AS $$
DECLARE
  avg_rating NUMERIC(3, 2);
  count_reviews INTEGER;
  curr_service_id UUID;
BEGIN
  -- Determine which service_id to update (handle INSERT/UPDATE/DELETE)
  IF TG_OP = 'DELETE' THEN
    curr_service_id := OLD.service_id;
  ELSE
    curr_service_id := NEW.service_id;
  END IF;

  -- Calculate new average and count
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
    COUNT(*)
  INTO avg_rating, count_reviews
  FROM public.reviews
  WHERE service_id = curr_service_id;

  -- Update the services table
  UPDATE public.services
  SET 
    rating = avg_rating,
    reviews_count = count_reviews
  WHERE id = curr_service_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_review_changed ON public.reviews;
CREATE TRIGGER on_review_changed
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_service_rating();
