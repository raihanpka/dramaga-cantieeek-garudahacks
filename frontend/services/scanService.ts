import { Platform } from 'react-native';
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
      // Tentukan ekstensi file dari URI (default .jpg)
      let extension = '.jpg';
      if (imageUri.endsWith('.png')) {
        extension = '.png';
      } else if (imageUri.endsWith('.jpeg')) {
        extension = '.jpeg';
      }
      const fileName = `scans/${userId}/${Date.now()}_${i}${extension}`;
      
      try {
        // Convert image URI to blob for upload
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        // Determine content type based on file extension or blob type
        let contentType = blob.type || 'image/jpeg';
        if (imageUri.endsWith('.png')) {
          contentType = 'image/png';
        }

        const { error } = await supabase.storage
          .from('scripture-images')
          .upload(fileName, blob, {
            contentType,
            upsert: false
          });
        
        if (error) {
          console.error('Upload error:', error);
          continue;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('scripture-images')
          .getPublicUrl(fileName);
        
        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
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
