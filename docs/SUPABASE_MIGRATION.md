# Migrasi dari Clerk ke Supabase Auth

## Overview
Panduan ini menjelaskan langkah-langkah untuk migrasi dari Clerk Authentication ke Supabase Authentication untuk aplikasi KalaNusa.

## Setup Supabase Project

### 1. Buat Supabase Project
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Buat project baru
3. Catat Project URL dan anon key

### 2. Setup Environment Variables
Tambahkan ke `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database Schema
Jalankan SQL dari `database-setup.sql` di Supabase SQL Editor:
- Membuat table `profiles` untuk user data
- Membuat table `scanned_scriptures` dengan referensi ke auth.users
- Setup Row Level Security policies
- Membuat storage buckets untuk images dan avatars
- Membuat trigger untuk auto-create profile

## Dependencies

### Dependencies yang Diperlukan
```bash
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
```

### Dependencies yang Dihapus
```bash
# Hapus Clerk dependencies
npm uninstall @clerk/clerk-expo expo-secure-store expo-web-browser expo-linking
```

## Changes Made

### 1. Auth Configuration (`lib/supabase.ts`)
- Konfigurasi Supabase client dengan AsyncStorage
- Definisi TypeScript interfaces
- Setup auth dengan persistent session

### 2. Auth Context (`context/AuthContext.tsx`)
- React Context untuk manage authentication state
- Hook `useAuth()` untuk access user data
- Auto refresh token handling

### 3. Auth Components
- `components/Auth.tsx`: Login/signup form
- `components/Account.tsx`: User profile management

### 4. App Structure Changes
- `app/_layout.tsx`: Wrap dengan AuthProvider
- `app/index.tsx`: Route logic berdasarkan auth state
- `app/auth.tsx`: Dedicated auth screen

### 5. Component Updates
- Replace `useUser()` dengan `useAuth()`
- Update user ID references dari `user.id` ke `user?.id`
- Update authentication checks

### 6. Database Schema Changes
- `user_id` sekarang menggunakan UUID (referensi ke auth.users)
- Policies menggunakan `auth.uid()` instead of JWT parsing
- Auto profile creation dengan trigger

## Authentication Flow

### Before (Clerk)
1. User signup/signin via Clerk
2. JWT token stored in secure storage
3. User data accessed via `useUser()`

### After (Supabase)
1. User signup/signin via Supabase Auth
2. Session stored in AsyncStorage
3. User data accessed via `useAuth()`
4. Automatic profile creation

## Testing Migration

### 1. Test Authentication
- Signup dengan email/password baru
- Login dengan credentials yang ada
- Logout functionality
- Session persistence

### 2. Test Camera Integration
- Camera access untuk authenticated users
- Image upload ke Supabase Storage
- Database insertion dengan proper user_id

### 3. Test Profile Features
- Profile creation/update
- Scripture tracking
- Achievement system

## Key Benefits

### 1. Simplified Auth
- Native Supabase integration
- Fewer dependencies
- Built-in user management

### 2. Better Database Integration
- Direct PostgreSQL access
- Row Level Security
- Real-time subscriptions

### 3. Cost Effective
- No additional auth service fees
- Integrated storage solution
- Scalable pricing

## Environment Setup

### Development
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### Production
- Gunakan production Supabase URL
- Setup email provider untuk verification
- Configure storage policies
- Setup database backups

## Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Dependencies updated
- [ ] Auth components implemented
- [ ] App routing updated
- [ ] Camera integration tested
- [ ] Profile features working
- [ ] Storage permissions configured
- [ ] Row Level Security tested

## Next Steps

1. Test semua fitur end-to-end
2. Setup email verification
3. Configure production environment
4. Deploy dan test di production
5. Monitor auth metrics di Supabase Dashboard

## Support

Jika ada masalah dengan migrasi:
1. Check Supabase logs di dashboard
2. Verify RLS policies
3. Test dengan Supabase CLI locally
4. Review auth events di dashboard
