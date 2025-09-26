import { get } from "http";
import { supabase } from '../supabaseClient.js';
import { toast } from '../hooks/use-toast';

// Authentication is handled through Supabase sessions

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export interface AddMarksRequest {
  student_id: string;
  marks: number;
  subject_id: number;
}

export interface AddMarksResponse {
  message: string;
  newMarks: MarkRecord;
  allMarks: MarkRecord[];
  totalCount: number;
}

export interface MarkRecord {
  id: number;
  created_at: string;
  subject_id: number;
  student_id: string;
  marks: number;
  marked_by: string;
  updated_at: string;
}

export interface GetMarksResponse {
  message: string;
  allMarks: MarkRecord[];
  totalCount: number;
  marker_id: string;
  subject_id: number;
}

export interface UpdateMarksRequest {
  student_id: string;
  marks: number;
  subject_id: number;
}

export interface UpdateMarksResponse {
  message: string;
  updatedMarks: MarkRecord;
  allMarks: MarkRecord[];
  totalCount: number;
}

export interface DeleteMarksRequest {
  student_id: string;
  subject_id: number;
}

export interface DeleteMarksResponse {
  message: string;
  deletedMarks: MarkRecord[];
  remainingMarks: MarkRecord[];
  totalRemainingCount: number;
  marker_id: string;
  student_id: number;
  subject_id: number;
}

export interface GetAllStudentsResponse {
  message: string;
  nics: string[];
  totalCount: number;
}

export interface SearchStudentsResponse {
  message: string;
  nics: string[];
  totalCount: number;
}

// Subject code mapping
export const SUBJECT_CODES = {
  'physics': 1,
  'combined maths': 2,
  'chemistry': 3
} as const;

// Helper function to get Supabase session token
const getSupabaseToken = async (): Promise<string | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting Supabase session:', error);
      return null;
    }
    
    if (!session?.access_token) {
      console.log('No active Supabase session found');
      return null;
    }
    
    return session.access_token;
  } catch (error) {
    console.error('Failed to get Supabase token:', error);
    return null;
  }
};

// Helper function to show success notifications
const showSuccessToast = (title: string, message: string) => {
  toast({
    title,
    description: message,
    variant: "default",
  });
};

// Helper function to show error notifications
const showErrorToast = (title: string, message: string) => {
  toast({
    title,
    description: message,
    variant: "destructive",
  });
};

// Helper function to extract clean error messages
const parseErrorMessage = (responseText: string, fallbackMessage: string): string => {
  try {
    const errorData = JSON.parse(responseText);
    // Extract the actual error message from various possible formats
    return errorData.error || errorData.message || errorData.details || fallbackMessage;
  } catch {
    // If it's not JSON, try to extract meaningful text
    const cleanText = responseText.replace(/[{}"\[\]]/g, '').trim();
    if (cleanText.length > 0 && cleanText.length < 200) {
      return cleanText;
    }
    return fallbackMessage;
  }
};

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";
// Utility function to decode JWT token and check expiration
export const getTokenInfo = (token: string) => {
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const exp = payload.exp; // Expiration time in seconds
    const iat = payload.iat; // Issued at time in seconds
    
    const isExpired = exp && exp < now;
    const expiresAt = exp ? new Date(exp * 1000) : null;
    const issuedAt = iat ? new Date(iat * 1000) : null;
    const timeRemaining = exp ? exp - now : null;
    
    // Calculate token duration (for Supabase default detection)
    const tokenDuration = exp && iat ? exp - iat : null;
    
    // Log Supabase-specific token information
    // console.log('🔍 === SUPABASE JWT TOKEN ANALYSIS ===');
    // console.log('📋 Token Payload:', payload);
    // console.log('👤 User Info:');
    // console.log('  - User ID (sub):', payload.sub);
    // console.log('  - Email:', payload.email);
    // console.log('  - Role:', payload.role || 'Not specified');
    // console.log('🏢 Token Metadata:');
    // console.log('  - Issuer (iss):', payload.iss);
    // console.log('  - Audience (aud):', payload.aud);
    // console.log('⏰ Timing Info:');
    // console.log('  - Issued at:', issuedAt?.toLocaleString());
    // console.log('  - Expires at:', expiresAt?.toLocaleString());
    // console.log('  - Token duration:', tokenDuration ? `${tokenDuration} seconds (${formatTimeRemaining(tokenDuration)})` : 'Unknown');
    
    // if (tokenDuration === 3600) {
    //   console.log('✅ CONFIRMED: Using Supabase default 1-hour (3600s) token duration');
    // } else if (tokenDuration) {
    //   console.log(`⚠️  CUSTOM: Token duration is ${tokenDuration} seconds (not the default 1 hour)`);
    // }
    
    // console.log('🔋 Current Status:');
    // console.log('  - Valid:', !isExpired);
    // console.log('  - Expired:', isExpired);
    // console.log('  - Time remaining:', timeRemaining && timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : 'Expired');
    // console.log('=== END TOKEN ANALYSIS ===');
    
    return {
      valid: !isExpired,
      expired: isExpired,
      expiresAt,
      issuedAt,
      timeRemaining: timeRemaining && timeRemaining > 0 ? timeRemaining : 0,
      timeRemainingFormatted: timeRemaining && timeRemaining > 0 ? formatTimeRemaining(timeRemaining) : 'Expired',
      tokenDuration,
      isSupabaseDefault: tokenDuration === 3600,
      payload
    };
  } catch (error) {
    return { valid: false, error: 'Failed to decode token' };
  }
};

// Helper function to format time remaining
const formatTimeRemaining = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Function to handle token expiration and redirect to login
export const handleTokenExpiration = (redirectToLogin = true) => {
  //console.log('🚨 === TOKEN EXPIRED - CLEANING UP ===');
  
  // Clear all authentication data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_id');
  
  //console.log('🧹 Cleared all authentication data from localStorage');
  
  if (redirectToLogin) {
    // Redirect to login page
    //console.log('🔄 Redirecting to login page...');
    //window.location.href = "/login";
    console.log("🔄token expired");
  }
  
  return { success: true, message: 'Token expired, redirected to login' };
};

// Function to check if Supabase session is valid
export const checkTokenExpiration = async (token?: string, autoRedirect = true) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      //console.log('❌ No valid Supabase session found');
      if (autoRedirect) {
        handleTokenExpiration();
      }
      return { expired: true, valid: false };
    }

    // Supabase handles token refresh automatically
    return { expired: false, valid: true };
  } catch (error) {
    console.error('Error checking Supabase session:', error);
    if (autoRedirect) {
      handleTokenExpiration();
    }
    return { expired: true, valid: false };
  }
};

// Function to check current Supabase session
export const checkCurrentToken = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      //console.log('❌ No Supabase session found');
      return null;
    }

    return {
      valid: true,
      expired: false,
      session: session
    };
  } catch (error) {
    console.error('Error checking current Supabase session:', error);
    return null;
  }
};

// Helper function to validate token before API calls
const validateTokenBeforeRequest = async (): Promise<string | null> => {
  const token = await getSupabaseToken();

  if (!token) {
    console.log('❌ No Supabase session found - redirecting to login');
    handleTokenExpiration();
    return null;
  }

  return token;
};

// Utility function to setup automatic token expiration monitoring
export const setupTokenMonitoring = (intervalMinutes = 5) => {
  const checkInterval = intervalMinutes * 60 * 1000; // Convert to milliseconds

  const monitorToken = async () => {
    const token = await getSupabaseToken();
    if (!token) {
      //console.log('🔍 Token monitor: No Supabase session found');
      return;
    }

    // Supabase handles token refresh automatically
    //console.log('� Token monitor: Supabase session is active');

    // Warn if token expires in less than 10 minutes
    //if (tokenInfo.timeRemaining && tokenInfo.timeRemaining < 600) {
      //console.log(`⚠️ Token monitor: Token expires soon (${tokenInfo.timeRemainingFormatted})`);
    //}
  };
  
  // Check immediately
  monitorToken();
  
  // Setup interval to check periodically
  const intervalId = setInterval(monitorToken, checkInterval);
  
  //console.log(`🔍 Token monitoring started (checking every ${intervalMinutes} minutes)`);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    //console.log('🔍 Token monitoring stopped');
  };
};


export const addMarks = async (student_id: string, marks: number, subject_id: number): Promise<AddMarksResponse> => {
  // Validate token before making the request
  const token = await validateTokenBeforeRequest();
  if (!token) {
    throw new Error('Authentication failed - redirecting to login');
  }
  
  // console.log('🚀 === ADD MARKS API CALL ===');
  // console.log('🔢 Subject ID being sent:', subject_id);
  // console.log('👤 Student ID:', student_id);
  // console.log('📊 Marks:', marks);
  // console.log('📤 Request URL:', `${API_BASE}/marker/addmarks`);
  // console.log('📤 Request body:', JSON.stringify({ student_id, marks, subject_id }));
  
  const res = await fetch(`${API_BASE}/marker/addmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ student_id, marks, subject_id }),
  });

  //console.log('📥 Add marks response status:', res.status);

  if (!res.ok) {
    const responseText = await res.text();
    //console.error('addMarks - Error response:', responseText);
    
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      //console.log('🚨 Authentication error - token may be expired');
      handleTokenExpiration();
      const errorMsg = "Authentication failed - please login again";
      showErrorToast("Authentication Error", errorMsg);
      throw new Error(errorMsg);
    }
    
    const errorMessage = parseErrorMessage(responseText, "Failed to add marks");
    
    // Handle specific error cases
    if (errorMessage.toLowerCase().includes("already exist") || 
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("already added")) {
      showErrorToast("Marks Already Added", `Marks already exist for student ${student_id}. Please update instead of adding new marks.`);
    } else {
      showErrorToast("Error Adding Marks", errorMessage);
    }
    
    throw new Error(errorMessage);
  }

  const responseText = await res.text();
  try {
    const result = JSON.parse(responseText);
    // console.log('📥 === ADD MARKS API RESPONSE ===');
    // console.log('📥 Full response object:', result);
    // console.log('📥 New marks created:', result.newMarks);
    // console.log('📥 All marks in response:', result.allMarks);
    // console.log('📥 Subject IDs in allMarks:', result.allMarks?.map((r: any) => r.subject_id) || []);
    // console.log('📥 === END ADD MARKS RESPONSE ===');
    
    // Show success message
    showSuccessToast("Marks Added Successfully!", result.message || `${marks} marks added for student ${student_id}`);
    
    return result;
  } catch (parseError) {
    console.error("addMarks - JSON parse error:", parseError);
    console.error("addMarks - Raw response:", responseText);
    const errorMsg = "Invalid JSON response from server";
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
    throw new Error(errorMsg);
  }
};

export const getMarks = async (subject_id: number): Promise<GetMarksResponse> => {
  // Validate token before making the request
  const token = await validateTokenBeforeRequest();
  if (!token) {
    throw new Error('Authentication failed - redirecting to login');
  }
  
  // console.log('🚀 === GET MARKS API CALL ===');
  // console.log('🔢 Subject ID being sent:', subject_id);
  // console.log('🔑 Token validated:', 'YES');
  // console.log('📤 Request URL:', `${API_BASE}/marker/getmarks`);
  // console.log('📤 Request body:', JSON.stringify({ subject_id }));
  
  const res = await fetch(`${API_BASE}/marker/getmarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ subject_id }),
  });

  // console.log('📥 Response status:', res.status);
  // console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      //console.log('🚨 Authentication error in getMarks - token may be expired');
      handleTokenExpiration();
      const errorMsg = "Authentication failed - please login again";
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }
    
    const responseText = await res.text();
    console.error("getMarks API error response:", responseText);
    const errorMessage = parseErrorMessage(
      responseText,
      "Failed to fetch marks"
    );
    toast({
      title: "Error Loading Marks",
      description: errorMessage,
      variant: "destructive",
    });
    throw new Error(errorMessage);
  }

  const result = await res.json();
  // console.log('📥 === GET MARKS API RESPONSE ===');
  // console.log('📥 Full response object:', result);
  // console.log('📥 Response.allMarks array:', result.allMarks);
  // console.log('📥 Number of records returned:', result.allMarks?.length || 0);
  // console.log('📥 Subject IDs in response:', result.allMarks?.map((r: any) => r.subject_id) || []);
  // console.log('📥 Expected subject_id was:', subject_id);
  // console.log('📥 === END GET MARKS RESPONSE ===');
  return result;
};

export const updateMarks = async (student_id: string, marks: number, subject_id: number): Promise<UpdateMarksResponse> => {
  // Validate token before making the request
  const token = await validateTokenBeforeRequest();
  if (!token) {
    throw new Error('Authentication failed - redirecting to login');
  }
  
  // console.log('updateMarks - Making API call to:', `${API_BASE}/marker/updatemarks`);
  // console.log('updateMarks - Request body:', { student_id, marks, subject_id });

  const res = await fetch(`${API_BASE}/marker/updatemarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ student_id, marks, subject_id }),
  });

  // console.log('updateMarks - Response status:', res.status);
  // console.log('updateMarks - Response headers:', res.headers);

  if (!res.ok) {
    const responseText = await res.text();
    console.error('updateMarks - Error response text:', responseText);
    
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      //console.log('🚨 Authentication error in updateMarks - token may be expired');
      handleTokenExpiration();
      const errorMsg = "Authentication failed - please login again";
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }

    const errorMessage = parseErrorMessage(
      responseText,
      "Failed to update marks"
    );
    toast({
      title: "Error Updating Marks",
      description: errorMessage,
      variant: "destructive",
    });
    throw new Error(errorMessage);
  }

  const responseText = await res.text();
  //console.log('updateMarks - Success response text:', responseText);
  
  try {
    const result = JSON.parse(responseText);
    
    // Show success message
    showSuccessToast("Marks Updated Successfully!", result.message || `Marks changed to ${marks} for student ${student_id}`);
    
    return result;
  } catch (parseError) {
    console.error("updateMarks - JSON parse error:", parseError);
    console.error("updateMarks - Raw response:", responseText);
    const errorMsg = "Invalid JSON response from server";
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
    throw new Error(errorMsg);
  }
};

export const deleteMarks = async (student_id: string, subject_id: number): Promise<DeleteMarksResponse> => {
  // Validate token before making the request
  const token = await validateTokenBeforeRequest();
  if (!token) {
    throw new Error('Authentication failed - redirecting to login');
  }
  
  // console.log('🗑️ === DELETE MARKS API CALL ===');
  // console.log('🔢 Subject ID being sent:', subject_id);
  // console.log('👤 Student ID:', student_id);
  // console.log('📤 Request URL:', `${API_BASE}/marker/deletemarks`);
  // console.log('📤 Request body:', JSON.stringify({ student_id, subject_id }));
  
  const res = await fetch(`${API_BASE}/marker/deletemarks`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ student_id, subject_id }),
  });

  //console.log('📥 Delete marks response status:', res.status);

  if (!res.ok) {
    const responseText = await res.text();
    console.error('deleteMarks - Error response:', responseText);
    
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      //console.log('🚨 Authentication error in deleteMarks - token may be expired');
      handleTokenExpiration();
      const errorMsg = "Authentication failed - please login again";
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }

    const errorMessage = parseErrorMessage(
      responseText,
      "Failed to delete marks"
    );
    toast({
      title: "Error Deleting Marks",
      description: errorMessage,
      variant: "destructive",
    });
    throw new Error(errorMessage);
  }

  const responseText = await res.text();
  try {
    const result = JSON.parse(responseText);
    // console.log('📥 === DELETE MARKS API RESPONSE ===');
    // console.log('📥 Full response object:', result);
    // console.log('📥 Deleted marks:', result.deletedMarks);
    // console.log('📥 All marks in response:', result.allMarks);
    // console.log('📥 === END DELETE MARKS RESPONSE ===');
    
    // Show success message
    showSuccessToast("Marks Deleted Successfully!", result.message || `Marks removed for student ${student_id}`);
    
    return result;
  } catch (parseError) {
    console.error("deleteMarks - JSON parse error:", parseError);
    console.error("deleteMarks - Raw response:", responseText);
    const errorMsg = "Invalid JSON response from server";
    toast({
      title: "Error",
      description: errorMsg,
      variant: "destructive",
    });
    throw new Error(errorMsg);
  }
};

// =====================================
// Get All Students (NICs) API
// =====================================
export const getAllStudents = async (): Promise<GetAllStudentsResponse> => {
  //console.log('🎓 === CALLING GET ALL STUDENTS API ===');

  const token = await getSupabaseToken();
  //console.log('🎓 Token found:', !!token);
  
  if (!token) {
    console.error("🎓 No Supabase session found - redirecting to login");
    handleTokenExpiration();
    const errorMsg = "No authentication token found";
    showErrorToast("Authentication Error", errorMsg);
    throw new Error(errorMsg);
  }

  //console.log('🎓 Making API request to:', `${API_BASE}/marker/getAllStudents`);
  
  try {
    const res = await fetch(`${API_BASE}/marker/getAllStudents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

  // console.log('🎓 Response status:', res.status);
  // console.log('🎓 Response ok:', res.ok);

  if (!res.ok) {
    const responseText = await res.text();
    console.error('🎓 Error response:', responseText);
    
    if (res.status === 401) {
      console.error('🎓 Unauthorized - handling token expiration');
      handleTokenExpiration();
      const errorMsg = 'Unauthorized access';
      showErrorToast("Authentication Error", errorMsg);
      throw new Error(errorMsg);
    }

    const errorMessage = parseErrorMessage(responseText, "Failed to get students");
    showErrorToast("Error Loading Student Data", errorMessage);
    throw new Error(errorMessage);
  }

  const responseText = await res.text();
  try {
    const result = JSON.parse(responseText);
    // console.log('📥 === GET ALL STUDENTS API RESPONSE ===');
    // console.log('📥 Full response object:', result);
    // console.log('📥 NICs array:', result.nics);
    // console.log('📥 Total count:', result.totalCount);
    // console.log('📥 === END GET ALL STUDENTS RESPONSE ===');
    return result;
  } catch (parseError) {
    console.error('getAllStudents - JSON parse error:', parseError);
    console.error('getAllStudents - Raw response:', responseText);
    const errorMsg = 'Invalid JSON response from server';
    showErrorToast("Error Loading Student Data", errorMsg);
    throw new Error(errorMsg);
  }
  } catch (networkError) {
    console.error('🎓 Network error in getAllStudents:', networkError);
    const errorMsg = 'Could not connect to the server. Please check your connection and try again.';
    showErrorToast("Connection Error", errorMsg);
    throw new Error(errorMsg);
  }
};

// =====================================
// Search Students by Partial NIC API
// =====================================
export const searchStudents = async (query: string): Promise<SearchStudentsResponse> => {
  // console.log('🔍 === CALLING SEARCH STUDENTS API ===');
  // console.log('🔍 Search query:', query);

  const token = await getSupabaseToken();
  //console.log('🔍 Token found:', !!token);
  
  if (!token) {
    console.error("🔍 No Supabase session found - redirecting to login");
    handleTokenExpiration();
    throw new Error("No authentication token found");
  }

  //console.log('🔍 Making API request to:', `${API_BASE}/marker/searchStudents`);
  
  const res = await fetch(`${API_BASE}/marker/searchStudents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() }),
  });

  // console.log('🔍 Response status:', res.status);
  // console.log('🔍 Response ok:', res.ok);

  if (!res.ok) {
    const responseText = await res.text();
    console.error('🔍 Error response:', responseText);
    
    if (res.status === 401) {
      console.error('🔍 Unauthorized - handling token expiration');
      handleTokenExpiration();
      throw new Error('Unauthorized access');
    }

    const errorMessage = parseErrorMessage(responseText, "Failed to search students");
    throw new Error(errorMessage);
  }

  const responseText = await res.text();
  try {
    const result = JSON.parse(responseText);
    // console.log('📥 === SEARCH STUDENTS API RESPONSE ===');
    // console.log('📥 Full response object:', result);
    // console.log('📥 Matching NICs:', result.nics);
    // console.log('📥 Total matches:', result.totalCount);
    // console.log('📥 === END SEARCH STUDENTS RESPONSE ===');
    return result;
  } catch (parseError) {
    console.error('searchStudents - JSON parse error:', parseError);
    console.error('searchStudents - Raw response:', responseText);
    throw new Error('Invalid JSON response from server');
  }
};