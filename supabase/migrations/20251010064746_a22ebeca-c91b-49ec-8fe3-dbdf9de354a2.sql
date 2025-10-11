-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create workers table
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  email TEXT,
  location TEXT NOT NULL,
  description TEXT,
  profile_image_url TEXT,
  experience_years INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create worker_images table for previous works
CREATE TABLE public.worker_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS work_images jsonb;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read access)
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- RLS Policies for workers (public read, authenticated create/update)
CREATE POLICY "Anyone can view workers"
  ON public.workers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create workers"
  ON public.workers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worker profile"
  ON public.workers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own worker profile"
  ON public.workers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for worker_images (public read, worker can manage)
CREATE POLICY "Anyone can view worker images"
  ON public.worker_images FOR SELECT
  USING (true);

CREATE POLICY "Workers can add their images"
  ON public.worker_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workers
      WHERE id = worker_images.worker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can update their images"
  ON public.worker_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workers
      WHERE id = worker_images.worker_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Workers can delete their images"
  ON public.worker_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workers
      WHERE id = worker_images.worker_id
      AND user_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO public.categories (name, description, image_url) VALUES
  ('DJ Services', 'Professional DJs for all types of events', '/placeholder.svg'),
  ('Catering', 'Delicious food and catering services', '/placeholder.svg'),
  ('Photography', 'Capture your special moments', '/placeholder.svg'),
  ('Decoration', 'Beautiful event decorations', '/placeholder.svg'),
  ('Venue Management', 'Complete venue setup and management', '/placeholder.svg'),
  ('Entertainment', 'Live bands, dancers, and entertainers', '/placeholder.svg');

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES public.workers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  service_type TEXT,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "Anyone can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their bookings" ON public.bookings FOR UPDATE USING (auth.role() = 'authenticated');