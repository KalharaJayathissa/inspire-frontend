import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImg from "@/assets/Background.jpg";
import { getStudentByNic, checkNicExists } from "@/lib/api";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

interface UploadResponse {
  ok: boolean;
  message: string;
}

// ============================================================================
// FALLBACK NIC LIST (used if /api/nics endpoint fails)
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
// MINIMAL TOAST SYSTEM IMPLEMENTATION
// ============================================================================

const useToasts = () => {
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

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

// ============================================================================
// TOAST COMPONENT
// ============================================================================

const ToastContainer: React.FC<{
  toasts: Toast[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md
            transform transition-all duration-300 ease-in-out
            ${
              toast.type === "success"
                ? "bg-green-500 text-white dark:bg-green-600"
                : toast.type === "error"
                ? "bg-red-500 text-white dark:bg-red-600"
                : "bg-blue-500 text-white dark:bg-blue-600"
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SubmissionsPage(): JSX.Element {
  // State management
  const [nic, setNic] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isValidatingNic, setIsValidatingNic] = useState(false);
  const [isNicValid, setIsNicValid] = useState<boolean | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Student information state
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [isFetchingStudent, setIsFetchingStudent] = useState(false);

  // Subject and part selection state
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Toast system
  const { toasts, addToast, removeToast } = useToasts();

  // Navigation
  const navigate = useNavigate();

  // ============================================================================
  // NIC VALIDATION LOGIC
  // ============================================================================

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

  // Debounced NIC validation
  const debouncedValidateNic = useCallback(
    (nicValue: string) => {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Reset validation state
      setIsNicValid(null);

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
            addToast("error", "NIC not found");
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
    [validateNic, addToast]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleNicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 12) {
      setNic(value);
      debouncedValidateNic(value);
    }
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        addToast("success", `File selected: ${selectedFile.name}`);
      } else {
        addToast("error", "Please select a PDF file");
        setFile(null);
      }
    } else {
      setFile(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !isNicValid) {
      addToast("error", "Please select a valid PDF and verify NIC");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("nic", nic);

      // Simulate upload progress (since fetch doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result: UploadResponse = await response.json();
        addToast("success", result.message || "File uploaded successfully");

        // Reset form
        setNic("");
        setFile(null);
        setIsNicValid(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        addToast("error", errorData.message || "Upload failed — try again");
      }
    } catch (error) {
      console.error("Upload error:", error);
      addToast("error", "Network error — please check your connection");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const isSubmitDisabled =
    !file ||
    isNicValid !== true ||
    isUploading ||
    isValidatingNic ||
    !selectedSubject ||
    !selectedPart;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-white/80 backdrop-blur-sm relative overflow-hidden">
      {/* Background image with low opacity - matching hero section */}
      <div className="absolute inset-0 -z-10">
        <img
          src={BackgroundImg}
          alt="Background"
          className="w-full h-full object-cover pointer-events-none opacity-40"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      {/* Background Effects - Similar to hero section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric decorative elements */}
        <div className="absolute top-20 left-8 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-8 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

        {/* Modern floating elements */}
        <div className="absolute top-32 left-16 w-4 h-4 bg-orange-400/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-48 right-24 w-6 h-6 bg-purple-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-24 w-5 h-5 bg-blue-400/60 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main Content - Desktop optimized layout */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Desktop Layout: Three columns for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Column: Information & Status (Desktop) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Enhanced Header */}
            <div className="relative">
              {/* Header Background Glow */}
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-32 bg-gradient-to-r from-blue-400/20 via-green-400/20 to-purple-400/20 rounded-2xl blur-2xl opacity-60"></div>
              </div>

              {/* Header Content */}
              <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-full p-2 border border-white/20">
                      <svg
                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 dark:from-white dark:via-blue-100 dark:to-green-100 bg-clip-text text-transparent mb-2 text-center">
                  Document Submission
                </h1>
                <p className="text-sm text-gray-700/80 dark:text-gray-300/80 font-medium leading-relaxed text-center">
                  Secure upload with instant NIC verification
                </p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="hidden lg:block relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
              <h3 className="text-base font-semibold text-black dark:text-black mb-3">
                Upload Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-black dark:text-black">
                    NIC Verification
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isNicValid === true
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : isNicValid === false
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                    }`}
                  >
                    {isValidatingNic
                      ? "Validating..."
                      : isNicValid === true
                      ? "Valid"
                      : isNicValid === false
                      ? "Invalid"
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-black dark:text-black">
                    PDF Document
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      file
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                    }`}
                  >
                    {file ? "Selected" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-black dark:text-black">
                    Ready to Submit
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      !isSubmitDisabled
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                    }`}
                  >
                    {!isSubmitDisabled ? "Ready" : "Not Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="hidden lg:block relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Student Information
              </h3>
              {isFetchingStudent ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                    Loading...
                  </span>
                </div>
              ) : studentInfo ? (
                <div className="space-y-2">
                  {studentInfo.fullName && (
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Name: {studentInfo.fullName}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      NIC: {studentInfo.nicNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Phone: {studentInfo.mobileNumber}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      School: {studentInfo.school}
                    </span>
                  </div>
                </div>
              ) : isNicValid ? (
                <div className="text-center py-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    NIC verified
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Enter valid NIC
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Student info will appear
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Column: Form (Desktop) / Full Width (Mobile) */}
          <div className="lg:col-span-6 lg:col-start-4">
            {/* Enhanced Main Card with Advanced Glassmorphism */}
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-green-400/20 to-purple-400/20 rounded-3xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>

              {/* Main Form Card */}
              <div className="relative bg-white/30 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/20">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Enhanced NIC Input */}
                  <div className="relative group/input">
                    <label
                      htmlFor="nic"
                      className="block text-base font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"
                    >
                      <div className="mr-3 p-2 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg border border-white/20">
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      </div>
                      National Identity Card (NIC)
                    </label>

                    <div className="relative">
                      {/* Input Background Glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-xl blur opacity-0 group-hover/input:opacity-60 transition duration-500"></div>

                      {/* Main Input */}
                      <div className="relative">
                        <input
                          id="nic"
                          type="text"
                          value={nic}
                          onChange={handleNicChange}
                          placeholder="Enter 12-digit NIC"
                          className={`
                            relative w-full px-6 py-4 border-2 rounded-xl text-lg font-medium
                            bg-white/50 dark:bg-white/5 backdrop-blur-xl 
                            placeholder-gray-500/70 dark:placeholder-gray-400/70
                            focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 focus:outline-none
                            transition-all duration-300 transform hover:scale-[1.01]
                            ${
                              isNicValid === true
                                ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10 text-green-900 dark:text-green-100 shadow-lg shadow-green-500/20"
                                : isNicValid === false
                                ? "border-red-500/50 bg-red-50/50 dark:bg-red-900/10 text-red-900 dark:text-red-100 shadow-lg shadow-red-500/20"
                                : "border-white/30 dark:border-white/10 text-gray-900 dark:text-white hover:border-blue-500/30"
                            }
                          `}
                          maxLength={12}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          aria-describedby="nic-help"
                        />

                        {/* Enhanced Validation Indicator */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          {isValidatingNic && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur animate-pulse"></div>
                              <div className="relative animate-spin rounded-full h-6 w-6 border-2 border-blue-500/30 border-t-blue-500"></div>
                            </div>
                          )}
                          {isNicValid === true && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-green-500/20 rounded-full blur animate-pulse"></div>
                              <div className="relative flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-full border border-green-500/30">
                                <svg
                                  className="w-5 h-5 text-green-600 dark:text-green-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                          {isNicValid === false && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-red-500/20 rounded-full blur animate-pulse"></div>
                              <div className="relative flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full border border-red-500/30">
                                <svg
                                  className="w-5 h-5 text-red-600 dark:text-red-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Helper Text */}
                    <div className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
                      <p
                        id="nic-help"
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isNicValid === true
                            ? "text-green-700 dark:text-green-300"
                            : isNicValid === false
                            ? "text-red-700 dark:text-red-300"
                            : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {isValidatingNic
                          ? "🔍 Validating your NIC number..."
                          : isNicValid === true
                          ? "✅ NIC verified successfully"
                          : isNicValid === false
                          ? "❌ NIC not found in our records"
                          : `💡 Enter your 12-digit NIC number (${nic.length}/12)`}
                      </p>
                    </div>
                  </div>

                  {/* Subject and Part Selection - Reserved space to prevent layout shifts */}
                  <div
                    className={`transition-all duration-500 ease-out ${
                      isNicValid
                        ? "min-h-[400px] opacity-100"
                        : "min-h-[50px] opacity-30"
                    }`}
                  >
                    {isNicValid ? (
                      <div className="space-y-6 transition-all duration-300 ease-out">
                        {/* Subject Selection */}
                        <div className="space-y-4">
                          <label className="block text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-red-400 mb-3">
                            Select Subject
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {["Physics", "Chemistry", "Mathematics"].map(
                              (subject) => (
                                <button
                                  key={subject}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSubject(subject);
                                    setSelectedPart(""); // Reset part selection when subject changes
                                  }}
                                  className={`
                                relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                                hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                                ${
                                  selectedSubject === subject
                                    ? "border-blue-500/60 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-teal-900/30 shadow-[0_8px_32px_rgba(59,130,246,0.25)]"
                                    : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-purple-300/50"
                                }
                              `}
                                >
                                  <div className="text-center">
                                    <div
                                      className={`text-lg font-semibold mb-1 ${
                                        selectedSubject === subject
                                          ? "text-blue-700 dark:text-blue-300"
                                          : "text-gray-700 dark:text-gray-300"
                                      }`}
                                    >
                                      {subject}
                                    </div>
                                    {selectedSubject === subject && (
                                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-white"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Part Selection - Only show when subject is selected */}
                        {selectedSubject && (
                          <div className="space-y-4 transition-all duration-300 ease-out">
                            <label className="block text-sm font-semibold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 mb-3">
                              Select Part for {selectedSubject}
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {selectedSubject === "Mathematics" ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPart("Pure")}
                                    className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                                    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                                    ${
                                      selectedPart === "Pure"
                                        ? "border-teal-500/60 bg-gradient-to-br from-teal-50/50 via-cyan-50/30 to-blue-50/50 dark:from-teal-900/30 dark:via-cyan-900/20 dark:to-blue-900/30 shadow-[0_8px_32px_rgba(20,184,166,0.25)]"
                                        : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-teal-300/50"
                                    }
                                  `}
                                  >
                                    <div className="text-center">
                                      <div
                                        className={`text-lg font-semibold mb-1 ${
                                          selectedPart === "Pure"
                                            ? "text-teal-700 dark:text-teal-300"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        Part I (Pure)
                                      </div>
                                      {selectedPart === "Pure" && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPart("Applied")}
                                    className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                                    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                                    ${
                                      selectedPart === "Applied"
                                        ? "border-cyan-500/60 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-indigo-50/50 dark:from-cyan-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 shadow-[0_8px_32px_rgba(6,182,212,0.25)]"
                                        : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-cyan-300/50"
                                    }
                                  `}
                                  >
                                    <div className="text-center">
                                      <div
                                        className={`text-lg font-semibold mb-1 ${
                                          selectedPart === "Applied"
                                            ? "text-cyan-700 dark:text-cyan-300"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        Part II (Applied)
                                      </div>
                                      {selectedPart === "Applied" && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPart("MCQ")}
                                    className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                                    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                                    ${
                                      selectedPart === "MCQ"
                                        ? "border-green-500/60 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30 shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
                                        : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-green-300/50"
                                    }
                                  `}
                                  >
                                    <div className="text-center">
                                      <div
                                        className={`text-lg font-semibold mb-1 ${
                                          selectedPart === "MCQ"
                                            ? "text-green-700 dark:text-green-300"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        Part I (MCQ)
                                      </div>
                                      {selectedPart === "MCQ" && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPart("Essay")}
                                    className={`
                                    relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                                    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                                    ${
                                      selectedPart === "Essay"
                                        ? "border-orange-500/60 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-yellow-50/50 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30 shadow-[0_8px_32px_rgba(249,115,22,0.25)]"
                                        : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-orange-300/50"
                                    }
                                  `}
                                  >
                                    <div className="text-center">
                                      <div
                                        className={`text-lg font-semibold mb-1 ${
                                          selectedPart === "Essay"
                                            ? "text-orange-700 dark:text-orange-300"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                      >
                                        Part II (Essay)
                                      </div>
                                      {selectedPart === "Essay" && (
                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Selection Summary */}
                        {selectedSubject && selectedPart && (
                          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm transition-all duration-300">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Selected: {selectedSubject} -{" "}
                                {selectedSubject === "Mathematics"
                                  ? `Part ${
                                      selectedPart === "Pure"
                                        ? "I (Pure)"
                                        : "II (Applied)"
                                    }`
                                  : `Part ${
                                      selectedPart === "MCQ"
                                        ? "I (MCQ)"
                                        : "II (Essay)"
                                    }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center space-y-2">
                          <div className="text-2xl">🔐</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Subject selection will appear after NIC validation
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <label
                      htmlFor="file"
                      className="block text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-teal-400 mb-3"
                    >
                      PDF Document Upload
                    </label>

                    {/* Premium Drop Zone */}
                    <div
                      className={`
                        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 
                        backdrop-blur-md bg-white/10 dark:bg-gray-800/10
                        shadow-[0_8px_32px_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
                        hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]
                        hover:scale-[1.02] hover:-translate-y-1
                        ${
                          isDragOver
                            ? "border-blue-400/60 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-teal-900/30 scale-105 shadow-[0_16px_50px_rgba(59,130,246,0.35)]"
                            : "border-gray-200/40 dark:border-gray-600/40 hover:border-blue-300/50 dark:hover:border-blue-500/50"
                        }
                      `}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        id="file"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-describedby="file-help"
                      />

                      <div className="space-y-4">
                        <div className="relative">
                          <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">
                            {file ? "✅" : "📄"}
                          </div>
                          {!file && (
                            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-teal-400/20 rounded-full blur-xl"></div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-base font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-100">
                            {file ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg flex items-center justify-center gap-2">
                                <span className="animate-bounce">✓</span>
                                {file.name}
                              </span>
                            ) : (
                              <>
                                <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                                  Click to upload
                                </span>
                                <span className="mx-2 text-gray-500 dark:text-gray-400">
                                  or
                                </span>
                                <span className="font-semibold">
                                  drag and drop
                                </span>
                              </>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
                            <span className="font-medium">
                              Accepted formats:
                            </span>{" "}
                            PDF files only
                          </p>
                        </div>
                      </div>

                      {/* Animated border glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm"></div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
                      <p
                        id="file-help"
                        className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-100"
                      >
                        {file ? (
                          <span className="flex items-center justify-between">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              📎 {file.name}
                            </span>
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full text-black dark:text-black font-medium">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>💡</span>
                            <span>
                              Select a PDF file to upload your document
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Premium Submit Button */}
                  <div className="relative group">
                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className={`
                        relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-colors duration-300
                        ${
                          isSubmitDisabled
                            ? "bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-sm border border-gray-300/30 dark:border-gray-600/30"
                            : `
                              bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white
                              hover:from-blue-700 hover:via-purple-700 hover:to-teal-700
                              hover:shadow-lg
                              focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                              shadow-md
                              border border-white/20 dark:border-gray-700/50
                            `
                        }
                      `}
                      aria-describedby="submit-help"
                    >
                      {/* Button content */}
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isUploading ? (
                          <>
                            <div className="relative">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                              <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full blur-sm"></div>
                            </div>
                            <span className="font-semibold tracking-wide">
                              Uploading Document...
                            </span>
                          </>
                        ) : isSubmitDisabled ? (
                          <>
                            <span className="text-2xl">⏳</span>
                            <span className="font-medium">
                              Complete Required Fields
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl">🚀</span>
                            <span className="font-bold tracking-wide">
                              Submit Document
                            </span>
                            <span className="text-2xl">✨</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  {/* Enhanced Status Information */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-600/40">
                    <p
                      id="submit-help"
                      className="text-sm font-medium text-center"
                    >
                      {isSubmitDisabled && !isUploading && (
                        <span className="space-y-2 block">
                          <span className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                            <span className="text-lg">⚠️</span>
                            <span className="font-semibold">
                              Action Required
                            </span>
                          </span>
                          <span className="flex flex-wrap items-center justify-center gap-1 text-gray-600 dark:text-gray-400">
                            {!file && (
                              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs">
                                📄 Select PDF file
                              </span>
                            )}
                            {isNicValid !== true && (
                              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                                🆔 Verify NIC
                              </span>
                            )}
                            {isValidatingNic && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs animate-pulse">
                                ⏳ Validating...
                              </span>
                            )}
                          </span>
                        </span>
                      )}
                      {!isSubmitDisabled && (
                        <span className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <span className="text-lg animate-bounce">✅</span>
                          <span className="font-semibold">
                            Ready to submit your document!
                          </span>
                          <span className="text-lg animate-pulse">🎉</span>
                        </span>
                      )}
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Mobile-only Progress and Security sections - shown after form */}
            <div className="lg:hidden mt-8 space-y-6">
              {/* Progress Indicators - Mobile */}
              <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
                <h3 className="text-base font-semibold text-black dark:text-black mb-3">
                  Upload Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-black">
                      NIC Verification
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isNicValid === true
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : isNicValid === false
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                      }`}
                    >
                      {isValidatingNic
                        ? "Validating..."
                        : isNicValid === true
                        ? "Valid"
                        : isNicValid === false
                        ? "Invalid"
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-black">
                      PDF Document
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        file
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                      }`}
                    >
                      {file ? "Selected" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-black">
                      Ready to Submit
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        !isSubmitDisabled
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                      }`}
                    >
                      {!isSubmitDisabled ? "Ready" : "Not Ready"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Information - Mobile */}
              <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Student Information
                </h3>
                {isFetchingStudent ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                      Loading...
                    </span>
                  </div>
                ) : studentInfo ? (
                  <div className="space-y-2">
                    {studentInfo.fullName && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Name: {studentInfo.fullName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        NIC: {studentInfo.nicNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Phone: {studentInfo.mobileNumber}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
                        style={{ animationDelay: "1s" }}
                      ></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        School: {studentInfo.school}
                      </span>
                    </div>
                  </div>
                ) : isNicValid ? (
                  <div className="text-center py-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      NIC verified
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Enter valid NIC
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Student info will appear
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Registration (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Registration Call-to-Action */}
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>

              {/* Main Registration Card */}
              <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
                <div className="text-center space-y-4">
                  {/* Icon */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-30 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                        <svg
                          className="w-8 h-8 text-green-600 dark:text-green-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 dark:from-white dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
                      Not Registered Yet?
                    </h3>
                    <p className="text-sm text-gray-700/80 dark:text-gray-300/80 font-medium leading-relaxed">
                      Join KESS INSPIRE 2025 and participate in the competition!
                    </p>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => navigate("/register")}
                    className="
                      relative w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden
                      bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white
                      hover:from-green-700 hover:via-emerald-700 hover:to-teal-700
                      hover:shadow-[0_15px_35px_rgba(34,197,94,0.4)] 
                      hover:scale-105 hover:-translate-y-1
                      focus:ring-4 focus:ring-green-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                      shadow-[0_6px_24px_rgba(31,38,135,0.25)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)]
                      border border-white/20 dark:border-gray-700/50
                    "
                  >
                    {/* Shine overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>

                    {/* Button content */}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className="font-bold tracking-wide">
                        Register Now
                      </span>
                    </span>

                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/50 via-emerald-400/50 to-teal-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  </button>

                  {/* Additional Info */}
                  <div className="pt-2 space-y-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      ✨ Quick & Easy Registration
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      🎯 Join 500+ Students
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-12 relative max-w-4xl mx-auto">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 dark:border-white/5">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600/70 dark:text-gray-400/70">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="mx-4 w-px h-4 bg-gray-300/50"></div>
              <div className="flex items-center space-x-2 text-sm text-gray-600/70 dark:text-gray-400/70">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Instant Processing</span>
              </div>
            </div>
            <p className="text-sm text-gray-600/80 dark:text-gray-400/80 font-medium">
              © All right reserved. Kegalle Engineering Students' Society (KESS)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
