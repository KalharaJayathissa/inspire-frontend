import { useState, useCallback, useRef } from "react";
import { Toast, StudentInfo } from "./types";
import { getStudentByNic, checkNicExists } from "@/lib/api";

// ============================================================================
// CONSTANTS
// ============================================================================

const VALID_NICS = [
  "123456789012",
  "987654321098",
  "456789123456",
  "789123456789",
  "321654987321",
  "654987321654",
  "147258369147",
  "258369147258",
  "369147258369",
  "741852963741",
];

// ============================================================================
// TOAST HOOK
// ============================================================================

export const useToasts = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      type,
      message,
      timestamp: Date.now(),
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};

// ============================================================================
// NIC VALIDATION HOOK
// ============================================================================

export const useNicValidation = (
  addToast: (type: Toast["type"], message: string) => void,
  onNicNotFound?: () => void
) => {
  const [isValidatingNic, setIsValidatingNic] = useState(false);
  const [isNicValid, setIsNicValid] = useState<boolean | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [isFetchingStudent, setIsFetchingStudent] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const validateNic = useCallback(
    async (nicValue: string): Promise<boolean> => {
      try {
        // Use the proper API function to check if NIC exists
        const result = await checkNicExists(nicValue);
        return result.success && result.exists;
      } catch (error) {
        // Network error or other issues - use fallback
        console.warn("NIC validation API error:", error);
        return VALID_NICS.includes(nicValue);
      }
    },
    []
  );

  const debouncedValidateNic = useCallback(
    (nicValue: string) => {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Reset validation state
      setIsNicValid(null);
      setStudentInfo(null);

      // Only validate if NIC is exactly 12 digits
      if (nicValue.length !== 12) {
        setIsValidatingNic(false);
        return;
      }

      setIsValidatingNic(true);
      addToast("info", "Validating NIC...");

      // Debounce validation by 200ms
      debounceRef.current = setTimeout(async () => {
        try {
          const isValid = await validateNic(nicValue);
          setIsNicValid(isValid);

          if (isValid) {
            addToast("success", "NIC valid");

            // Fetch student information
            setIsFetchingStudent(true);
            try {
              const studentData = await getStudentByNic(nicValue);
              // Extract the student object from the API response
              if (studentData.success && studentData.student) {
                setStudentInfo(studentData.student);
              } else {
                setStudentInfo(null);
              }
            } catch (studentError) {
              console.error("Error fetching student info:", studentError);
              setStudentInfo(null);
              // Don't show error toast for student info, just silently fail
            } finally {
              setIsFetchingStudent(false);
            }
          } else {
            if (onNicNotFound) {
              onNicNotFound();
            } else {
              addToast("error", "NIC not found");
            }
            setStudentInfo(null);
          }
        } catch (error) {
          console.error("NIC validation error:", error);
          setIsNicValid(false);
          setStudentInfo(null);
          addToast("error", "NIC validation failed");
        } finally {
          setIsValidatingNic(false);
        }
      }, 200);
    },
    [validateNic, addToast, onNicNotFound]
  );

  const clearNicValidation = useCallback(() => {
    setIsNicValid(null);
    setStudentInfo(null);
    setIsValidatingNic(false);
    setIsFetchingStudent(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  }, []);

  return {
    isValidatingNic,
    isNicValid,
    studentInfo,
    isFetchingStudent,
    debouncedValidateNic,
    clearNicValidation,
  };
};

// ============================================================================
// FILE UPLOAD HOOK
// ============================================================================

export const useFileUpload = (
  addToast: (type: Toast["type"], message: string) => void
) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      if (selectedFile) {
        if (selectedFile.type !== "application/pdf") {
          addToast("error", "Please select a PDF file");
          return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
          addToast("error", "File size must be less than 10MB");
          return;
        }
        setFile(selectedFile);
        addToast("success", "File selected successfully");
      } else {
        setFile(null);
      }
    },
    [addToast]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileChange(droppedFile);
      }
    },
    [handleFileChange]
  );

  return {
    file,
    isDragOver,
    isUploading,
    uploadProgress,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setIsUploading,
    setUploadProgress,
  };
};
