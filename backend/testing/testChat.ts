import path from "path";

const API_BASE = "http://localhost:3000/api";

// Test Chat API dengan berbagai skenario
async function testChatAPI() {
  console.log("� Testing Kala Chatbot API...\n");

  try {
    // Test health endpoint
    console.log("1. Testing chat health endpoint...");
    const healthResponse = await fetch(`${API_BASE}/chat/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Chat Health:", healthData);

    // Test berbagai pertanyaan budaya
    const testQuestions = [
      "Apa itu Batik Mega Mendung?",
      "Jelaskan tentang Candi Borobudur",
      "Apa makna filosofis Keris Jangkung?",
      "Ceritakan tentang Tari Saman dari Aceh",
      "Bagaimana cara membuat batik tulis?"
    ];

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      console.log(`\n${i + 2}. Testing question: "${question}"`);
      
      const chatResponse = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: question,
          threadId: `test-thread-${i + 1}`
        })
      });
      
      const chatData = await chatResponse.json() as any;
      
      if (chatData.success) {
        console.log(`✅ Response received:`, {
          responseLength: chatData.data?.response?.length || 0,
          threadId: chatData.data?.threadId,
          processingTime: `${chatData.processing_time_ms}ms`,
          toolsUsed: chatData.data?.toolResults?.length || 0
        });
        
        // Show first 100 characters of response
        const preview = chatData.data?.response?.substring(0, 100) + "...";
        console.log(`   Preview: "${preview}"`);
      } else {
        console.error(`❌ Failed:`, chatData.error);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test chat history untuk salah satu thread
    console.log(`\n${testQuestions.length + 2}. Testing chat history...`);
    const historyResponse = await fetch(`${API_BASE}/chat/history/test-thread-1`);
    const historyData = await historyResponse.json();
    console.log("✅ Chat History:", historyData);

    // Test error handling - empty message
    console.log(`\n${testQuestions.length + 3}. Testing error handling (empty message)...`);
    const errorResponse = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "",
        threadId: "test-error"
      })
    });
    
    const errorData = await errorResponse.json() as any;
    console.log("✅ Error handling test:", {
      status: errorResponse.status,
      success: errorData.success,
      error: errorData.error
    });

  } catch (error) {
    console.error("❌ Chat API Test Error:", error);
  }
}

// Test koneksi dan performa
async function testChatPerformance() {
  console.log("\n⚡ Testing Chat Performance...\n");

  const startTime = Date.now();
  const concurrentTests = [];

  // Test 3 request bersamaan
  for (let i = 0; i < 3; i++) {
    concurrentTests.push(
      fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `Test concurrent request ${i + 1} - Apa itu wayang?`,
          threadId: `concurrent-${i + 1}`
        })
      })
    );
  }

  try {
    const responses = await Promise.all(concurrentTests);
    const endTime = Date.now();
    
    console.log(`✅ Concurrent requests completed in ${endTime - startTime}ms`);
    
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response) {
        const data = await response.json() as any;
        console.log(`   Request ${i + 1}: ${data.success ? 'Success' : 'Failed'} (${data.processing_time_ms}ms)`);
      }
    }
    
  } catch (error) {
    console.error("❌ Performance test failed:", error);
  }
}

// Main test function untuk chatbot
async function runChatbotTests() {
  console.log("🚀 Starting Kala Chatbot Tests\n");
  console.log("Make sure the server is running on http://localhost:3000\n");

  await testChatAPI();
  await testChatPerformance();

  console.log("\n✨ Chatbot Tests completed!");
  console.log("\n📝 Manual testing with curl:");
  console.log(`curl -X POST ${API_BASE}/chat \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"message": "Apa itu keris?", "threadId": "manual-test"}'`);
}

// Run chatbot tests
runChatbotTests().catch(console.error);
