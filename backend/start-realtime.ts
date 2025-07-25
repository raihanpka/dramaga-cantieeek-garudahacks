#!/usr/bin/env node

import { join } from 'path';
import { spawn } from 'child_process';

console.log('🚀 Starting NusaScan Real-time Server with Monitoring');
console.log('==================================================\n');

// Start the main server
console.log('📡 Starting Express server...');
const isProduction = process.env.NODE_ENV === 'production';
const command = isProduction ? 'node' : 'tsx';
const args = isProduction ? ['dist/server.js'] : ['server.ts'];

const server = spawn(command, args, {
  cwd: process.cwd(),
  stdio: 'pipe',
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
});

let serverReady = false;

// Monitor server output
server.stdout?.on('data', (data) => {
  const output = data.toString();
  console.log('🖥️  Server:', output.trim());
  
  if (output.includes('listening on') || output.includes('Server running')) {
    serverReady = true;
    console.log('✅ Server is ready!\n');
    
    // Wait a moment then run performance tests
    setTimeout(runPerformanceTests, 2000);
  }
});

server.stderr?.on('data', (data) => {
  console.log('❌ Server Error:', data.toString().trim());
});

// Function to run performance tests
async function runPerformanceTests() {
  console.log('🧪 Running automated performance tests...\n');
  
  try {
    // Import and run the test
    const { testRealtimeAPI } = await import('./test-realtime.js');
    await testRealtimeAPI();
  } catch (error) {
    console.log('❌ Performance test failed:', error);
  }
  
  console.log('\n⚡ Real-time monitoring is now active');
  console.log('📊 Server logs will continue to appear above');
  console.log('🔗 API available at: http://localhost:3000/scan');
  console.log('\n💡 Test endpoints:');
  console.log('   • Health: curl http://localhost:3000/scan/health');
  console.log('   • Types: curl http://localhost:3000/scan/supported-types');
  console.log('   • Analysis: curl -X POST http://localhost:3000/scan -F "image=@yourimage.jpg"');
  console.log('\n🛑 Press Ctrl+C to stop the server');
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down NusaScan server...');
  server.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

// Keep the process alive
server.on('close', (code) => {
  console.log(`\n🔴 Server process exited with code ${code}`);
  process.exit(code || 0);
});
