// Test script to validate submission status API integration
// You can run this in the browser console on the submissions page

// Test function to check API integration
async function testSubmissionStatusAPI() {
  console.log("🧪 Testing Submission Status API Integration");

  try {
    // Import the API function
    const { getSubmissionStatus } = await import("./src/lib/api.js");

    // Test with known NIC
    const testNIC = "200423603249";
    console.log(`📞 Calling API for NIC: ${testNIC}`);

    const response = await getSubmissionStatus(testNIC);
    console.log("📥 Raw API Response:", response);

    // Validate response structure
    if (response.success) {
      console.log("✅ API Response successful");

      if (response.data && response.data.submissions) {
        console.log(`📊 Found ${response.data.submissions.length} submissions`);
        console.log("📋 Submissions:", response.data.submissions);

        // Test subject matching
        const testSubmission = response.data.submissions[0];
        if (testSubmission) {
          console.log(
            `🎯 Testing subject matching for: ${testSubmission.subject} ${testSubmission.part}`
          );

          // Test the matching logic used in component
          const subjects = ["Physics", "Chemistry", "Mathematics"];
          const parts = ["Part I", "Part II"];

          subjects.forEach((subject) => {
            parts.forEach((part) => {
              const isMatch = response.data.submissions.some(
                (submission) =>
                  submission.subject.toLowerCase() === subject.toLowerCase() &&
                  submission.part === part
              );
              console.log(
                `${isMatch ? "✅" : "❌"} ${subject} ${part}: ${
                  isMatch ? "SUBMITTED" : "NOT SUBMITTED"
                }`
              );
            });
          });

          // Calculate progress
          const totalPapers = 6;
          const submittedCount = response.data.submissions.length;
          const percentage = (submittedCount / totalPapers) * 100;
          console.log(
            `📈 Progress: ${submittedCount}/${totalPapers} (${percentage.toFixed(
              2
            )}%)`
          );
        }
      } else {
        console.log("⚠️ No submissions data found in response");
      }

      if (response.data && response.data.statistics) {
        console.log("📊 Statistics:", response.data.statistics);
      }
    } else {
      console.log("❌ API Response failed:", response.message);
    }
  } catch (error) {
    console.error("💥 API Test Failed:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
  }
}

// Instructions for testing
console.log(`
🔧 Submission Status API Test Instructions:

1. Open your browser and go to the submissions page
2. Open Developer Tools (F12)
3. Go to Console tab
4. Copy and paste this entire script
5. Run: testSubmissionStatusAPI()

This will test the API integration and show detailed logs.
`);

// Export for use
window.testSubmissionStatusAPI = testSubmissionStatusAPI;
