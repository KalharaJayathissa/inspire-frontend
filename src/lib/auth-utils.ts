import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

/**
 * Handles authentication/authorization failures by clearing the session and redirecting to login
 * @param navigate - React Router navigate function
 * @param error - The error object to determine appropriate message
 * @param customMessage - Optional custom message to show instead of default
 */
export const handleAuthFailure = async (
  navigate: (path: string) => void,
  error?: any,
  customMessage?: string
) => {
  try {
    // Clear the current session
    await supabase.auth.signOut();

    // Determine appropriate message based on error
    let message = customMessage;
    if (!message) {
      if (error?.response?.status === 403) {
        message =
          "You don't have permission to access this resource. Please log in with proper credentials.";
      } else if (error?.response?.status === 401) {
        message = "Your session has expired. Please log in again.";
      } else {
        message = "Authentication required. Please log in to continue.";
      }
    }

    toast.error(message);

    // Redirect to login page
    navigate("/login");
  } catch (signOutError) {
    console.error("Error during session cleanup:", signOutError);
    // Still redirect even if signOut fails
    navigate("/login");
  }
};

// Keep the old function name for backward compatibility
export const handleSessionExpired = handleAuthFailure;

/**
 * Checks if an error indicates authentication/authorization failure
 * @param error - The error object to check
 * @returns true if the error indicates user should be redirected to login
 */
export const isAuthError = (error: any): boolean => {
  return (
    error.response?.status === 401 || // Unauthorized (session expired, invalid token)
    error.response?.status === 403 || // Forbidden (no access to route/resource)
    error.message === "No authentication token found" ||
    error.message?.includes("JWT") || // JWT related errors
    error.message?.includes("token") || // Generic token errors
    error.message?.includes("unauthorized") || // Generic unauthorized errors
    error.message?.includes("forbidden") // Generic forbidden errors
  );
};

// Keep the old function name for backward compatibility
export const isSessionError = isAuthError;

/**
 * Handles API errors with automatic authentication/authorization failure detection
 * @param error - The error object
 * @param navigate - React Router navigate function
 * @param fallbackMessage - Message to show for non-auth errors
 * @returns true if auth error was handled, false otherwise
 */
export const handleApiError = async (
  error: any,
  navigate: (path: string) => void,
  fallbackMessage: string = "An error occurred. Please try again."
): Promise<boolean> => {
  if (isAuthError(error)) {
    await handleAuthFailure(navigate, error);
    return true;
  }

  // Show fallback error message
  toast.error(fallbackMessage);
  console.error("API Error:", error);
  return false;
};
