import axios from 'axios';
import { supabase } from '../supabaseClient';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function getstudents() {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession();
  
  
  if (!session) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(`${baseURL}/api/admin/students`, {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  });
  
  // Extract the students array from the response
  // Handle case where response.data has a 'students' property
  return response.data.students || response.data;
}

export async function registerStudent(studentData) {
  const response = await axios.post(`${baseURL}/api/public/students/register`, studentData);
  return response.data;
}

export async function checkNicExists(nicNumber) {
  const response = await axios.get(`${baseURL}/api/public/students/check-nic/${nicNumber}`);
  return response.data;
}