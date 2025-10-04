// Secure Backend API Testing for Download Tracking
// Test the backend API endpoints from frontend perspective

console.log("Testing Secure Download Tracking API...");

// Test functions for manual testing (paste in browser console)
window.testDownloadAPI = {
  // Test API connection
  testAPIConnection: async function () {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/downloads/1`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("✅ API connection test passed:", data);
        return true;
      } else {
        console.error(
          "❌ API connection test failed:",
          response.status,
          response.statusText
        );
        return false;
      }
    } catch (error) {
      console.error("❌ API connection test failed:", error);
      return false;
    }
  },

  // Test fetching a single download count
  testGetDownloadCount: async function (paperId = "1") {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/downloads/${paperId}`
      );
      const data = await response.json();

      if (response.ok) {
        console.log(
          `✅ Successfully fetched count for paper ${paperId}:`,
          data.download_count
        );
        return data.download_count;
      } else {
        console.error(`❌ Error fetching count for paper ${paperId}:`, data);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error fetching count for paper ${paperId}:`, error);
      return null;
    }
  },

  // Test batch fetching download counts
  testGetAllDownloadCounts: async function () {
    try {
      const paperIds = ["1", "2", "3", "4", "5", "6"];
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/downloads/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paper_ids: paperIds,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(
          "✅ Successfully fetched all download counts:",
          data.download_counts
        );
        return data.download_counts;
      } else {
        console.error("❌ Error fetching all download counts:", data);
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching all download counts:", error);
      return null;
    }
  },

  // Test incrementing a download count
  testIncrementCount: async function (paperId = "1") {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/downloads/${paperId}/increment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paper_id: paperId,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log(
          `✅ Successfully incremented count for paper ${paperId}. New count:`,
          data.new_count
        );
        return data.new_count;
      } else {
        console.error(
          `❌ Error incrementing count for paper ${paperId}:`,
          data
        );
        return null;
      }
    } catch (error) {
      console.error(`❌ Error incrementing count for paper ${paperId}:`, error);
      return null;
    }
  },

  // Run all tests
  runAllTests: async function () {
    console.log("🧪 Running all download tracking tests...\n");

    // Test 1: API Connection
    console.log("1. Testing API connection...");
    const connectionTest = await this.testAPIConnection();

    if (!connectionTest) {
      console.log(
        "❌ API connection failed. Make sure backend server is running."
      );
      return false;
    }

    // Test 2: Get single count
    console.log("\n2. Testing single download count fetch...");
    const singleCount = await this.testGetDownloadCount("1");

    // Test 3: Get batch counts
    console.log("\n3. Testing batch download counts fetch...");
    const batchCounts = await this.testGetAllDownloadCounts();

    // Test 4: Increment count
    console.log("\n4. Testing download count increment...");
    const incrementResult = await this.testIncrementCount("1");

    // Test 5: Verify increment worked
    console.log("\n5. Verifying increment worked...");
    const newCount = await this.testGetDownloadCount("1");

    if (incrementResult && newCount && newCount > (singleCount || 100)) {
      console.log("✅ Increment verification passed!");
    } else {
      console.log("❌ Increment verification failed!");
    }

    console.log("\n🏁 All tests completed!");
    return true;
  },
};

// Manual testing instructions
console.log(`
📋 Manual Testing Instructions:

1. 🚀 Start Backend Server:
   - Make sure your backend API server is running on port 5000
   - Verify database is set up with required tables

2. 🔍 Test API Endpoints:
   Open browser console on the exam papers page and run:
   
   // Test individual functions:
   window.testDownloadAPI.testAPIConnection()
   window.testDownloadAPI.testGetDownloadCount('1')
   window.testDownloadAPI.testGetAllDownloadCounts()
   window.testDownloadAPI.testIncrementCount('1')
   
   // Or run all tests at once:
   window.testDownloadAPI.runAllTests()

3. 📊 Test Frontend Integration:
   - Load the exam papers page
   - Check that download counts appear (should show "100+" initially)
   - Click a download button
   - Verify count increments by 1
   - Verify file downloads successfully

4. 🛠️ Test Error Handling:
   - Stop the backend server
   - Reload page - should show "100+" (fallback)
   - Click download - file should still download but count won't increment
   - Start server - counts should load properly again

5. 🏋️ Test Performance:
   - Open browser dev tools → Network tab
   - Reload exam papers page
   - Should see 1 batch request to /api/downloads/batch (not 6 individual requests)
   - Each download should trigger 1 request to /api/downloads/:id/increment

✅ Expected Results:
- All API endpoints respond correctly
- Download counts display and increment properly
- Downloads work even when API is unavailable
- Fallback shows "100+" when backend unavailable
- Efficient batch loading on page load
`);

// Environment check
if (typeof window !== "undefined" && window.location) {
  console.log("🌐 Current environment:");
  console.log("- Frontend URL:", window.location.origin);
  console.log(
    "- API Base URL:",
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
  );
  console.log("- Test functions available as window.testDownloadAPI.*");
} else {
  console.log(
    "This file should be run in a browser environment with the frontend loaded."
  );
}
