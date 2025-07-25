import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase, ScannedScripture, ScanResult } from '@/lib/supabase';

export class ScanService {
  private static getApiUrl(): string {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api-kalanusa.vercel.app';
    return Platform.select({
      ios: baseUrl,
      android: baseUrl,
      web: baseUrl,
      default: baseUrl,
    });
  }

  /**
   * Upload gambar ke Supabase Storage
   */
  static async uploadImages(images: string[], userId: string): Promise<string[]> {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const imageUri = images[i];
      console.log('Uploading imageUri:', imageUri);
      let extension = '.jpg';
      if (imageUri.endsWith('.png')) extension = '.png';
      else if (imageUri.endsWith('.jpeg')) extension = '.jpeg';
      const fileName = `${userId}/${Date.now()}_${i}${extension}`;
      try {
        let fileBuffer: Uint8Array | null = null;
        let contentType = extension === '.png' ? 'image/png' : 'image/jpeg';
        if (imageUri.startsWith('file://')) {
          // Read file as binary for upload
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (!fileInfo.exists) {
            console.error('File does not exist:', imageUri);
            continue;
          }
          const fileData = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
          fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
        } else if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
          // Fallback to fetch for remote images
          let response: Response;
          try {
            response = await fetch(imageUri);
          } catch (fetchErr) {
            console.error('Fetch imageUri failed:', imageUri, fetchErr);
            continue;
          }
          if (!response || !response.ok) {
            console.error('Fetch response not ok for:', imageUri, response?.status);
            continue;
          }
          try {
            const blob = await response.blob();
            fileBuffer = new Uint8Array(await blob.arrayBuffer());
          } catch (blobErr) {
            console.error('Failed to convert to blob:', imageUri, blobErr);
            continue;
          }
        } else {
          console.error('Unsupported URI scheme:', imageUri);
          continue;
        }
        if (!fileBuffer) {
          console.error('No file buffer for:', imageUri);
          continue;
        }
        const { data, error } = await supabase.storage
          .from('scripture-images')
          .upload(fileName, fileBuffer, {
            contentType,
            upsert: false
          });
        if (error) {
          console.error('Upload error:', error.message || error, fileName);
          continue;
        }
        const { data: publicUrlData } = supabase.storage
          .from('scripture-images')
          .getPublicUrl(fileName);
        if (!publicUrlData?.publicUrl) {
          console.error('Failed to get public URL for:', fileName);
          continue;
        }
        // Pastikan URL HTTPS
        let publicUrl = publicUrlData.publicUrl;
        if (publicUrl.startsWith('http://')) {
          publicUrl = publicUrl.replace('http://', 'https://');
        }
        console.log('Public image URL:', publicUrl);
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error, imageUri);
      }
    }
    return uploadedUrls;
  }

    /**
   * Submit gambar untuk analisis dengan upload ke Supabase dan backend
   */
  static async submitForAnalysis(
    images: string[],
    title: string,
    description: string,
    userId: string
  ): Promise<ScanResult> {
    try {
      // 1. Upload gambar ke Supabase Storage
      const uploadedUrls = await this.uploadImages(images, userId);
      
      if (uploadedUrls.length === 0) {
        throw new Error('Failed to upload any images');
      }

      // 2. Simpan data ke database Supabase
      const { data, error } = await supabase
        .from('scanned_scriptures')
        .insert({
          title,
          description,
          user_id: userId,
          image_urls: uploadedUrls,
          status: 'processing',
          progress: 0
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 3. Proses di background dengan backend API
      this.processInBackground(data.id, uploadedUrls);

      return {
        success: true,
        data: data,
        message: 'Images uploaded successfully and processing started'
      };
    } catch (error) {
      console.error('Submit for analysis error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit for analysis'
      };
    }
  }

  /**
   * Process analisis di background
   */
  private static async processInBackground(scriptureId: string, imageUrls: string[]) {
    try {
      // Update progress to transliterating
      await this.updateProgress(scriptureId, 25, 'transliterating');
      
      // Process the first image for now (you can extend this to process all images)
      const imageUrl = imageUrls[0];
      console.log('Background analysis using imageUrl:', imageUrl);
      // Convert image URL to FormData
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, 'image.jpg');
      // Call scan API
      const scanResponse = await fetch(`${this.getApiUrl()}/api/scan`, {
        method: 'POST',
        body: formData,
      });
      const result: ScanResult = await scanResponse.json();
      
      if (result.success) {
        // Update progress to reviewing
        await this.updateProgress(scriptureId, 75, 'reviewing');
        
        // Simulate review process
        setTimeout(async () => {
          // Update with final result
          await supabase
            .from('scanned_scriptures')
            .update({
              status: 'approved',
              progress: 100,
              analysis_result: result.data,
              updated_at: new Date().toISOString()
            })
            .eq('id', scriptureId);
        }, 2000);
      } else {
        // Mark as rejected if analysis failed
        await supabase
          .from('scanned_scriptures')
          .update({
            status: 'rejected',
            progress: 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', scriptureId);
      }
    } catch (error) {
      console.error('Background processing error:', error);
      // Mark as rejected on error
      await supabase
        .from('scanned_scriptures')
        .update({
          status: 'rejected',
          progress: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', scriptureId);
    }
  }

  /**
   * Update progress scripture
   */
  private static async updateProgress(
    scriptureId: string, 
    progress: number, 
    status: ScannedScripture['status']
  ) {
    await supabase
      .from('scanned_scriptures')
      .update({
        progress,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', scriptureId);
  }

  /**
   * Get user's scanned scriptures
   */
  static async getUserScriptures(userId: string): Promise<ScannedScripture[]> {
    try {
      const { data, error } = await supabase
        .from('scanned_scriptures')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching scriptures:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserScriptures:', error);
      return [];
    }
  }

  /**
   * Listen to scripture updates (real-time)
   */
  static subscribeToScriptureUpdates(
    userId: string, 
    callback: (scriptures: ScannedScripture[]) => void
  ) {
    return supabase
      .channel('scripture_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scanned_scriptures',
          filter: `user_id=eq.${userId}`
        },
        () => {
          // Refetch all scriptures when any update occurs
          this.getUserScriptures(userId).then(callback);
        }
      )
      .subscribe();
  }
}
