#!/usr/bin/env bun

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Test script untuk validasi real-time performance
async function testRealtimeAPI() {
  const serverUrl = 'http://localhost:3000/scan';
  
  console.log('🚀 NusaScan Real-time Performance Test');
  console.log('=====================================\n');

  // Test 1: Health Check
  console.log('1. Testing health endpoint...');
  try {
    const healthResponse = await fetch(`${serverUrl}/health`);
    const healthData = await healthResponse.json() as any;
    console.log('✅ Health check:', healthData.status);
    console.log(`⏱️  Response time: ${healthData.uptime || 'N/A'}ms\n`);
  } catch (error) {
    console.log('❌ Health check failed:', error);
    return;
  }

  // Test 2: Supported Types
  console.log('2. Testing supported types...');
  try {
    const typesResponse = await fetch(`${serverUrl}/supported-types`);
    const typesData = await typesResponse.json() as any;
    console.log('✅ Supported types loaded:', typesData.supported_formats?.length || 0, 'formats');
    console.log('📋 Categories:', typesData.cultural_categories?.length || 0, 'categories\n');
  } catch (error) {
    console.log('❌ Supported types failed:', error);
    return;
  }

  // Test 3: Real-time Analysis Performance
  console.log('3. Testing real-time analysis performance...');
  
  // Create test image data (dummy file for testing)
  const testImagePath = join(process.cwd(), 'test-image.jpg');
  
  if (!existsSync(testImagePath)) {
    console.log('📝 Creating dummy test image...');
    // Create a minimal test file
    const dummyImageData = new Uint8Array([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46
    ]);
    await Bun.write(testImagePath, dummyImageData);
  }

  const formData = new FormData();
  const imageFile = new File([readFileSync(testImagePath)], 'test-image.jpg', {
    type: 'image/jpeg'
  });
  formData.append('image', imageFile);

  console.log('📤 Uploading test image...');
  const startTime = Date.now();

  try {
    const analysisResponse = await fetch(serverUrl, {
      method: 'POST',
      body: formData
    });

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.log('❌ Analysis failed:', analysisResponse.status, errorText);
      return;
    }

    const analysisData = await analysisResponse.json() as any;
    
    console.log('✅ Analysis completed successfully!');
    console.log(`⏱️  Total processing time: ${totalTime}ms`);
    console.log(`📊 Server processing time: ${analysisData.processing_time_ms || 'N/A'}ms`);
    console.log(`🎯 Performance target: ${totalTime < 15000 ? '✅ PASSED' : '❌ FAILED'} (< 15 seconds)`);
    
    if (analysisData.data) {
      console.log('\n📋 Analysis Results:');
      console.log('🔍 Object Recognition:', analysisData.data.object_recognition?.object_type || 'N/A');
      console.log('📝 Text Extraction:', analysisData.data.text_extraction?.extracted_text?.substring(0, 100) || 'N/A');
      console.log('🌐 Cultural Analysis:', analysisData.data.cultural_analysis?.cultural_significance ? '✅ Found' : '❌ None');
      console.log('🔎 Grounding Search:', analysisData.data.grounding_search?.verification_status || 'N/A');
    }

  } catch (error) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    console.log('❌ Analysis failed:', error);
    console.log(`⏱️  Failed after: ${totalTime}ms`);
  }

  // Test 4: Streaming Performance
  console.log('\n4. Testing streaming endpoint...');
  try {
    const streamResponse = await fetch(`${serverUrl}/stream`, {
      method: 'POST',
      body: formData
    });

    if (!streamResponse.ok) {
      console.log('❌ Streaming failed:', streamResponse.status);
      return;
    }

    const reader = streamResponse.body?.getReader();
    const decoder = new TextDecoder();
    let streamStartTime = Date.now();
    let lastUpdateTime = streamStartTime;

    console.log('📡 Monitoring real-time stream...');

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const currentTime = Date.now();
              const timeSinceStart = currentTime - streamStartTime;
              const timeSinceLastUpdate = currentTime - lastUpdateTime;
              
              console.log(`📈 [${timeSinceStart}ms] ${data.stage}: ${data.message} ${data.progress ? `(${data.progress}%)` : ''}`);
              
              if (data.status === 'completed') {
                console.log(`✅ Streaming completed in ${timeSinceStart}ms`);
                console.log(`🎯 Streaming performance: ${timeSinceStart < 15000 ? '✅ PASSED' : '❌ FAILED'} (< 15 seconds)`);
              }
              
              lastUpdateTime = currentTime;
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    }

  } catch (error) {
    console.log('❌ Streaming test failed:', error);
  }

  console.log('\n🎉 Real-time performance testing completed!');
  console.log('🚀 NusaScan API is ready for real-time cultural heritage analysis!');
}

// Run test if called directly
if (import.meta.main) {
  testRealtimeAPI().catch(console.error);
}

export { testRealtimeAPI };
