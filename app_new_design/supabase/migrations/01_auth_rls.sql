-- Function to handle new users signing up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, phone, verified, wallet_balance, is_admin)
  VALUES (new.id, new.phone, true, 0, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user insertion in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read profiles (needed to display seller info on listings)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.users;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.users FOR SELECT
  USING ( true );

-- Policy: Users can only update their own profile
DROP POLICY IF EXISTS "Users can update own profile." ON public.users;
CREATE POLICY "Users can update own profile."
  ON public.users FOR UPDATE
  USING ( auth.uid() = id );
