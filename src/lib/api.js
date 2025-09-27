import axios from "axios";
import { supabase } from "../supabaseClient";

// const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://inspirebackend-production.up.railway.app/';

// const baseURL = 'https://inspirebackend-production.up.railway.app';
const baseURL = "http://192.168.8.129:3000"; // Local backend for development

// Helper function to get authentication headers
async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function getstudents() {
  const headers = await getAuthHeaders();

  const response = await axios.get(`${baseURL}/api/admin/students`, {
    headers,
  });

  // Extract the students array from the response
  // Handle case where response.data has a 'students' property
  return response.data.students || response.data;
}

// ATTENDANCE SYSTEM API FUNCTIONS

// 1. Health Check
export async function checkAttendanceHealth() {
  const response = await axios.get(`${baseURL}/api/invigilator/health`);
  return response.data;
}

// 2. Get All Schools
export async function fetchSchools() {
  try {
    const headers = await getAuthHeaders();

    console.log("Calling fetchSchools");
    console.log("Request URL:", `${baseURL}/api/invigilator/schools`);

    const response = await axios.get(`${baseURL}/api/invigilator/schools`, {
      headers,
    });

    console.log("fetchSchools response:", response.data);
    return response.data.schools || response.data;
  } catch (error) {
    console.error("fetchSchools error:", error);

    // Try the original API endpoint as fallback
    try {
      console.log("Trying original endpoint: /api/invigilator/schools");
      const headers = await getAuthHeaders();
      const response = await axios.get(`${baseURL}/api/invigilator/schools`, {
        headers,
      });
      console.log("Original endpoint response:", response.data);
      return response.data.schools || response.data;
    } catch (fallbackError) {
      console.error("Both endpoints failed:", fallbackError);
      throw error; // Throw the original error
    }
  }
}

// 3. Get Students by School (returns NICs only for search optimization)
export async function fetchStudentsBySchool(schoolId) {
  const headers = await getAuthHeaders();

  const response = await axios.get(
    `${baseURL}/api/invigilator/students?school_id=${schoolId}`,
    {
      headers,
    }
  );

  return response.data.students;
}

// 4. Register New Student
export async function registerStudentFromInvigilator(studentData) {
  const headers = await getAuthHeaders();

  const response = await axios.post(
    `${baseURL}/api/invigilator/students/register`,
    studentData,
    {
      headers,
    }
  );

  return response.data;
}

// 5. Mark/Update Attendance
export async function markAttendance(studentSchoolId, status, nic, school_id) {
  const headers = await getAuthHeaders();

  const response = await axios.post(
    `${baseURL}/api/invigilator/attendance/mark`,
    {
      student_school_id: studentSchoolId,
      status: status, // 1 = Present, 0 = Absent
      nic: nic, // Include NIC in the request
      school_id: school_id, // Include school_id in the request
    },
    {
      headers,
    }
  );

  return response.data;
}

// 6. Get Today's Attendance Report
export async function getTodaysAttendance(schoolId) {
  try {
    const headers = await getAuthHeaders();

    console.log("Calling getTodaysAttendance with schoolId:", schoolId);
    console.log(
      "Request URL:",
      `${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`
    );

    const response = await axios.get(
      `${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`,
      {
        headers,
      }
    );
    console.log("result!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(response);

    console.log("getTodaysAttendance response:", response.data);

    // Handle different response structures
    if (response.data && response.data.attendance) {
      console.log("Found attendance property:", response.data.attendance);
      return response.data.attendance;
    } else if (Array.isArray(response.data)) {
      console.log("Response data is array:", response.data);
      return response.data;
    } else {
      console.log("Response data structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("getTodaysAttendance error with /api/invigilator:", error);

    // Try the original API endpoint as fallback
    try {
      console.log(
        "Trying original endpoint: /api/invigilator/attendance/today"
      );
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`,
        {
          headers,
        }
      );
      console.log("Original endpoint response:", response.data);

      if (response.data && response.data.attendance) {
        return response.data.attendance;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (fallbackError) {
      console.error("Both attendance endpoints failed:", fallbackError);
      throw error; // Throw the original error
    }
  }
}

export async function registerStudent(studentData) {
  const response = await axios.post(
    `${baseURL}/api/public/students/register`,
    studentData
  );
  return response.data;
}

export async function checkNicExists(nicNumber) {
  const response = await axios.get(
    `${baseURL}/api/public/students/check-nic/${nicNumber}`
  );
  return response.data;
}

// Fetch student information by NIC for submissions page
export async function getStudentByNic(nicNumber) {
  try {
    const response = await axios.get(
      `${baseURL}/api/public/students/info/${nicNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
}

// Mock submission function for testing (use when backend is not ready)
export async function submitDocumentMock(formData, onUploadProgress) {
  try {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (onUploadProgress) {
        onUploadProgress(i);
      }
    }

    // Mock successful response
    return {
      success: true,
      message: "Document submitted successfully! (Mock Mode)",
      submissionId: "mock-" + Date.now(),
      data: {
        nic: formData.get("nic"),
        subject: formData.get("subject"),
        part: formData.get("part"),
        fileName: formData.get("generatedFileName"),
        uploadTime: new Date().toISOString(),
      },
    };
  } catch (error) {
    throw {
      message: "Mock submission failed",
      status: 500,
      data: null,
    };
  }
}

// Submit PDF document for a student
export async function submitDocument(formData, onUploadProgress) {
  try {
    // Extract data for filename generation
    const nic = formData.get("nic");
    const subject = formData.get("subject");
    const part = formData.get("part");
    const originalFile = formData.get("file");

    // Generate standardized filename
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")[0];
    const subjectCode = subject.replace(/\s+/g, "").toLowerCase(); // Remove spaces, lowercase
    const partCode = part.replace(/\s+/g, "").toLowerCase(); // "Part A" -> "parta"
    const newFileName = `${nic}_${subjectCode}_${partCode}_${timestamp}.pdf`;

    // Create new FormData with renamed file
    const submissionData = new FormData();

    // Rename the file by creating a new File object
    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });

    // Append all form data with the renamed file
    submissionData.append("file", renamedFile);
    submissionData.append("nic", formData.get("nic"));
    submissionData.append("subject", formData.get("subject"));
    submissionData.append("part", formData.get("part"));

    // Optional fields
    if (formData.get("studentName")) {
      submissionData.append("studentName", formData.get("studentName"));
    }
    if (formData.get("mobileNumber")) {
      submissionData.append("mobileNumber", formData.get("mobileNumber"));
    }
    if (formData.get("school")) {
      submissionData.append("school", formData.get("school"));
    }

    // Metadata for backend processing
    submissionData.append("originalFileName", originalFile.name);
    submissionData.append("generatedFileName", newFileName);

    const response = await axios.post(
      `${baseURL}/api/submissions/upload`,
      submissionData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(percentCompleted);
          }
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting document:", error);

    // Enhanced error handling for different scenarios
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      throw {
        message: errorData?.message || `Server error: ${error.response.status}`,
        status: error.response.status,
        data: errorData,
      };
    } else if (error.request) {
      // Request made but no response received
      throw {
        message:
          "Backend server is not responding. Please check if the server is running.",
        status: 0,
        data: null,
      };
    } else {
      // Something else happened
      throw {
        message: error.message || "An unexpected error occurred",
        status: -1,
        data: null,
      };
    }
  }
}

// Get submission status for a student
export async function getSubmissionStatus(nicNumber) {
  try {
    const response = await axios.get(
      `${baseURL}/api/submissions/status/${nicNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching submission status:", error);
    throw error;
  }
}
