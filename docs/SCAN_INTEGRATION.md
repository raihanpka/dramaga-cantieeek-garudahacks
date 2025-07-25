# Integrasi API Scan dengan Frontend

## Overview
Sistem scan yang terintegrasi antara backend API dan frontend mobile app untuk digitalisasi naskah dan prasasti bersejarah Indonesia.

## Flow Integration

### 1. Camera → Upload → Processing → Database
```
Camera/Gallery → Supabase Storage → Backend API → Analysis → Database Update → Real-time UI Update
```

### 2. Data Flow
1. User mengambil foto atau upload dari galeri
2. Frontend upload ke Supabase Storage
3. Frontend submit metadata ke database dengan status 'processing'
4. Background service call backend API untuk analisis
5. Backend return hasil analisis
6. Update database dengan hasil dan status 'approved'
7. Real-time update di profile user

## Setup Requirements

### 1. Supabase Setup
1. Create new Supabase project
2. Run SQL script dari `database-setup.sql`
3. Setup environment variables di `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Backend Setup
- Backend sudah support multiple image upload
- Endpoint: `POST /api/scan` with `images[]` field
- Return structured analysis result

### 3. Frontend Components

#### ScanService (`/services/scanService.ts`)
- Handle upload to Supabase Storage
- Submit data to database
- Background processing dengan backend API
- Real-time subscription untuk updates

#### Camera.tsx Updates
- Integrasi dengan ScanService
- User authentication via Clerk
- Progress tracking dan feedback

#### Profile.tsx Updates
- Real-time data dari Supabase
- Achievement system berdasarkan jumlah scan
- Progress tracking untuk setiap submission

## Key Features

### 1. Multi-Image Support
- Users dapat upload multiple images per submission
- Backend process first image for analysis
- All images stored di Supabase Storage

### 2. Real-time Progress Tracking
- Status: processing → transliterating → reviewing → approved
- Progress percentage (0-100%)
- Real-time updates menggunakan Supabase subscriptions

### 3. Achievement System
- Automatic unlock berdasarkan jumlah submissions
- Synced dengan real data dari database

### 4. Secure Storage
- Row Level Security di Supabase
- Users hanya bisa access data mereka sendiri
- Public image access untuk thumbnails

## Usage Instructions

### For Users:
1. Open Camera from scan tab
2. Take photos atau upload dari galeri
3. Add title dan description
4. Submit untuk processing
5. Track progress di Profile tab

### For Developers:
1. Setup Supabase project dan database
2. Configure environment variables
3. Install dependencies: `@supabase/supabase-js`
4. Run dan test dengan development server

## Database Schema

### scanned_scriptures table:
- `id`: UUID primary key
- `title`: Text, required
- `description`: Text, optional
- `user_id`: Text, from Clerk authentication
- `status`: Enum of processing stages
- `progress`: Integer 0-100
- `image_urls`: Array of image URLs
- `analysis_result`: JSONB dari backend API
- `thumbnail_url`: Public URL untuk thumbnail
- `created_at`, `updated_at`: Timestamps

## Error Handling

### Frontend:
- Network error handling
- Upload failure retry
- User feedback dengan alerts

### Backend:
- Multi-file cleanup
- Timeout handling (15 seconds max)
- Structured error responses

### Database:
- Row Level Security
- Data validation constraints
- Automatic timestamp updates

## Performance Considerations

### Storage:
- Image compression (quality: 0.8)
- Thumbnail generation
- Public CDN access

### Processing:
- Background processing untuk avoid UI blocking
- Real-time progress updates
- Timeout protection

### Database:
- Indexed queries untuk performance
- Pagination support untuk large datasets
- Real-time subscriptions dengan Supabase

## Future Enhancements

1. **Batch Processing**: Process multiple images dalam satu submission
2. **OCR Integration**: Extract text dari analysis result
3. **Search Functionality**: Search berdasarkan content atau metadata
4. **Export Features**: Download hasil analysis dalam berbagai format
5. **Collaborative Features**: Share dan comment pada submissions
6. **Advanced Analytics**: Dashboard untuk contribution statistics

## Testing

### Integration Testing:
1. Test upload flow end-to-end
2. Test real-time updates
3. Test error scenarios (network failure, large files, etc.)
4. Test authentication dan authorization
5. Test achievement system updates

### Performance Testing:
1. Large file uploads
2. Multiple concurrent uploads
3. Real-time subscription performance
4. Database query performance dengan large datasets
