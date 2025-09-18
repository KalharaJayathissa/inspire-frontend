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
    