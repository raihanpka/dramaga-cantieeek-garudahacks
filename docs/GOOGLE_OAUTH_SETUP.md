# Google OAuth Setup untuk Supabase Auth

## 1. Setup Google Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang sudah ada
3. Aktifkan Google+ API di API Library
4. Buat OAuth 2.0 Client IDs di Credentials:
   - **Web Application**: untuk Supabase
   - **Android**: untuk Android app (jika ada)
   - **iOS**: untuk iOS app (jika ada)

### Web Client ID (untuk Supabase)
- Authorized JavaScript origins: `https://euwmoxrambyxxkbzxdpa.supabase.co`
- Authorized redirect URIs: `https://euwmoxrambyxxkbzxdpa.supabase.co/auth/v1/callback`

## 2. Setup Supabase Authentication

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pergi ke Authentication > Providers
3. Enable Google provider
4. Masukkan:
   - **Client ID**: Web Client ID dari Google Console
   - **Client Secret**: Web Client Secret dari Google Console

## 3. Update Environment Variables

Update file `.env` dengan Google Web Client ID:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id_here.googleusercontent.com
```

## 4. Android Configuration (jika diperlukan)

Untuk Android app, tambahkan konfigurasi di `android/app/build.gradle`:

```gradle
android {
    ...
    defaultConfig {
        ...
        manifestPlaceholders = [
            'googleWebClientId': 'your_google_web_client_id_here.googleusercontent.com'
        ]
    }
}
```

## 5. iOS Configuration (jika diperlukan)

Untuk iOS app, tambahkan konfigurasi di `ios/YourApp/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>googleusercontent</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>your_reversed_google_client_id</string>
        </array>
    </dict>
</array>
```

## 6. Testing

Setelah konfigurasi selesai:

1. Jalankan aplikasi dengan `bun start`
2. Coba login dengan Google
3. Periksa di Supabase Dashboard apakah user berhasil dibuat

## Troubleshooting

### Error: "Google Sign-In SDK not configured"
- Pastikan `GoogleSignin.configure()` dipanggil sebelum menggunakan Google Sign-In
- Periksa Web Client ID sudah benar

### Error: "DEVELOPER_ERROR"
- Periksa SHA-1 fingerprint untuk Android
- Pastikan package name sesuai dengan Google Console

### Error: "SIGN_IN_CANCELLED"
- User membatalkan proses sign-in
- Handle dengan graceful error message

### Error: "No ID token present"
- Periksa scope yang diminta
- Pastikan Web Client ID valid
