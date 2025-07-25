-- Supabase SQL untuk setup authentication dan tables
-- Jalankan ini di Supabase SQL Editor

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  fullname TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create table for scanned scriptures
CREATE TABLE scanned_scriptures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'transliterating', 'reviewing', 'approved', 'certified', 'rejected')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  thumbnail_url TEXT,
  image_urls TEXT[] NOT NULL DEFAULT '{}',
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_scanned_scriptures_user_id ON scanned_scriptures(user_id);
CREATE INDEX idx_scanned_scriptures_status ON scanned_scriptures(status);
CREATE INDEX idx_scanned_scriptures_created_at ON scanned_scriptures(created_at DESC);

-- Enable Row Level Security
ALTER TABLE scanned_scriptures ENABLE ROW LEVEL SECURITY;

-- Create policy untuk users hanya bisa melihat data mereka sendiri
CREATE POLICY "Users can only see their own scriptures" 
ON scanned_scriptures FOR SELECT 
USING (user_id = auth.uid());

-- Create policy untuk users bisa insert data mereka sendiri
CREATE POLICY "Users can insert their own scriptures" 
ON scanned_scriptures FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Create policy untuk users bisa update data mereka sendiri
CREATE POLICY "Users can update their own scriptures" 
ON scanned_scriptures FOR UPDATE 
USING (user_id = auth.uid());

-- Create storage bucket untuk scripture images
INSERT INTO storage.buckets (id, name, public) VALUES ('scripture-images', 'scripture-images', true);

-- Create storage bucket untuk avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create policy untuk storage bucket scripture images
CREATE POLICY "Anyone can view scripture images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'scripture-images');

CREATE POLICY "Authenticated users can upload scripture images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'scripture-images' AND auth.role() = 'authenticated');

-- Create policy untuk storage bucket avatars
CREATE POLICY "Anyone can view avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create policy untuk storage bucket
CREATE POLICY "Anyone can view scripture images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'scripture-images');

CREATE POLICY "Users can upload scripture images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'scripture-images');

-- Function untuk update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_scanned_scriptures_updated_at 
    BEFORE UPDATE ON scanned_scriptures 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
