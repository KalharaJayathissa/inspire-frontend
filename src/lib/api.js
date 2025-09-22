import axios from 'axios';
import { supabase } from '../supabaseClient';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
// const baseURL = 'http://10.10.11.87:3000';

// Helper function to get authentication headers
async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No authentication token found');
  }

  return {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  };
}

export async function getstudents() {
  const headers = await getAuthHeaders();

  const response = await axios.get(`${baseURL}/api/admin/students`, {
    headers
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
    
    console.log('Calling fetchSchools');
    console.log('Request URL:', `${baseURL}/api/invigilator/schools`);
    
    const response = await axios.get(`${baseURL}/api/invigilator/schools`, {
      headers
    });
    
    console.log('fetchSchools response:', response.data);
    return response.data.schools || response.data;
  } catch (error) {
    console.error('fetchSchools error:', error);
    
    // Try the original API endpoint as fallback
    try {
      console.log('Trying original endpoint: /api/invigilator/schools');
      const headers = await getAuthHeaders();
      const response = await axios.get(`${baseURL}/api/invigilator/schools`, {
        headers
      });
      console.log('Original endpoint response:', response.data);
      return response.data.schools || response.data;
    } catch (fallbackError) {
      console.error('Both endpoints failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
}

// 3. Get Students by School (returns NICs only for search optimization)
export async function fetchStudentsBySchool(schoolId) {
  const headers = await getAuthHeaders();
  
  const response = await axios.get(`${baseURL}/api/invigilator/students?school_id=${schoolId}`, {
    headers
  });
  
  return response.data.students;
}

// 4. Register New Student
export async function registerStudent(studentData) {
  const headers = await getAuthHeaders();
  
  const response = await axios.post(`${baseURL}/api/invigilator/students/register`, studentData, {
    headers
  });
  
  return response.data;
}

// 5. Mark/Update Attendance
export async function markAttendance(studentSchoolId, status) {
  const headers = await getAuthHeaders();
  
  const response = await axios.post(`${baseURL}/api/invigilator/attendance/mark`, {
    student_school_id: studentSchoolId,
    status: status // 1 = Present, 0 = Absent
  }, {
    headers
  });
  
  return response.data;
}

// 6. Get Today's Attendance Report
export async function getTodaysAttendance(schoolId) {
  try {
    const headers = await getAuthHeaders();
    
    console.log('Calling getTodaysAttendance with schoolId:', schoolId);
    console.log('Request URL:', `${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`);
    
    const response = await axios.get(`${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`, {
      headers
    });
    
    console.log('getTodaysAttendance response:', response.data);
    
    // Handle different response structures
    if (response.data && response.data.attendance) {
      console.log('Found attendance property:', response.data.attendance);
      return response.data.attendance;
    } else if (Array.isArray(response.data)) {
      console.log('Response data is array:', response.data);
      return response.data;
    } else {
      console.log('Response data structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('getTodaysAttendance error with /api/invigilator:', error);
    
    // Try the original API endpoint as fallback
    try {
      console.log('Trying original endpoint: /api/invigilator/attendance/today');
      const headers = await getAuthHeaders();
      const response = await axios.get(`${baseURL}/api/invigilator/attendance/today?school_id=${schoolId}`, {
        headers
      });
      console.log('Original endpoint response:', response.data);
      
      if (response.data && response.data.attendance) {
        return response.data.attendance;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    } catch (fallbackError) {
      console.error('Both attendance endpoints failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
}
    