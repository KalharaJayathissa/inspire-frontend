import React, { useState, useEffect, useCallback, useRef } from "react";
import BackgroundImg from "@/assets/Background.jpg";

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

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Toast system
  const { toasts, addToast, removeToast } = useToasts();

  // ============================================================================
  // NIC VALIDATION LOGIC
  // ============================================================================

  const validateNic = useCallback(
    async (nicValue: string): Promise<boolean> => {
      try {
        // First, try to fetch from API endpoint
        const response = await fetch("/api/nics");

        if (response.ok) {
          const validNics: string[] = await response.json();
          return validNics.includes(nicValue);
        } else {
          // Fallback to inline list if API fails (404 or other error)
          console.warn("NIC API endpoint failed, using fallback list");
          return VALID_NICS.includes(nicValue);
        }
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
          } else {
            addToast("error", "NIC not found");
          }
        } catch (error) {
          console.error("NIC validation error:", error);
          setIsNicValid(false);
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
    !file || isNicValid !== true || isUploading || isValidatingNic;

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
        <div className="absolute top-48 right-24 w-6 h-6 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-24 w-5 h-5 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Main Content - Desktop optimized layout */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        
        {/* Desktop Layout: Two columns for larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Left Column: Information & Status (Desktop) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Enhanced Header */}
            <div className="relative">
              {/* Header Background Glow */}
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-40 bg-gradient-to-r from-blue-400/20 via-green-400/20 to-purple-400/20 rounded-3xl blur-2xl opacity-60"></div>
              </div>
              
              {/* Header Content */}
              <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-white/10 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-30 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-blue-500/20 to-green-500/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-green-900 dark:from-white dark:via-blue-100 dark:to-green-100 bg-clip-text text-transparent mb-4 text-center">
                  Document Submission
                </h1>
                <p className="text-base text-gray-700/80 dark:text-gray-300/80 font-medium leading-relaxed text-center">
                  Secure upload with instant NIC verification
                </p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Upload Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">NIC Verification</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    isNicValid === true 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : isNicValid === false
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
                  }`}>
                    {isValidatingNic ? 'Validating...' : isNicValid === true ? 'Valid' : isNicValid === false ? 'Invalid' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">PDF Document</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    file 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
                  }`}>
                    {file ? 'Selected' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ready to Submit</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    !isSubmitDisabled
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300'
                  }`}>
                    {!isSubmitDisabled ? 'Ready' : 'Not Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">End-to-end Encryption</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-time Validation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Secure File Storage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form (Desktop) / Full Width (Mobile) */}
          <div className="lg:col-span-8">
            
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
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
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
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                          {isNicValid === false && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-red-500/20 rounded-full blur animate-pulse"></div>
                              <div className="relative flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-full border border-red-500/30">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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
                                <span className="mx-2 text-gray-500 dark:text-gray-400">or</span>
                                <span className="font-semibold">drag and drop</span>
                              </>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
                            <span className="font-medium">Accepted formats:</span> PDF files only
                          </p>
                        </div>
                      </div>

                      {/* Animated border glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm"></div>
                    </div>

                    <div
                      className="mt-3 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30"
                    >
                      <p
                        id="file-help"
                        className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-100"
                      >
                        {file ? (
                          <span className="flex items-center justify-between">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              📎 {file.name}
                            </span>
                            <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <span>💡</span>
                            <span>Select a PDF file to upload your document</span>
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
                        relative w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden
                        ${
                          isSubmitDisabled
                            ? "bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-sm border border-gray-300/30 dark:border-gray-600/30"
                            : `
                              bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white
                              hover:from-blue-700 hover:via-purple-700 hover:to-teal-700
                              hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)] 
                              hover:scale-105 hover:-translate-y-1
                              focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                              shadow-[0_8px_32px_rgba(31,38,135,0.25)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                              border border-white/20 dark:border-gray-700/50
                              animate-shine
                            `
                        }
                      `}
                      aria-describedby="submit-help"
                    >
                      {/* Shine overlay effect */}
                      {!isSubmitDisabled && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                      )}
                      
                      {/* Button content */}
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isUploading ? (
                          <>
                            <div className="relative">
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                              <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full blur-sm"></div>
                            </div>
                            <span className="font-semibold tracking-wide">Uploading Document...</span>
                          </>
                        ) : isSubmitDisabled ? (
                          <>
                            <span className="text-2xl">⏳</span>
                            <span className="font-medium">Complete Required Fields</span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl animate-bounce">🚀</span>
                            <span className="font-bold tracking-wide">Submit Document</span>
                            <span className="text-2xl animate-pulse">✨</span>
                          </>
                        )}
                      </span>

                      {/* Animated background glow */}
                      {!isSubmitDisabled && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-teal-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                      )}
                    </button>

                    {/* Floating particles effect */}
                    {!isSubmitDisabled && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-2 left-4 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                        <div className="absolute top-4 right-6 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                        <div className="absolute bottom-3 left-8 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Status Information */}
                  <div
                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-600/40"
                  >
                    <p
                      id="submit-help"
                      className="text-sm font-medium text-center"
                    >
                      {isSubmitDisabled && !isUploading && (
                        <span className="space-y-2 block">
                          <span className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
                            <span className="text-lg">⚠️</span>
                            <span className="font-semibold">Action Required</span>
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
                          <span className="font-semibold">Ready to submit your document!</span>
                          <span className="text-lg animate-pulse">🎉</span>
                        </span>
                      )}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-12 relative max-w-4xl mx-auto">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 dark:border-white/5">
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600/70 dark:text-gray-400/70">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Secure & Encrypted</span>
              </div>
              <div className="mx-4 w-px h-4 bg-gray-300/50"></div>
              <div className="flex items-center space-x-2 text-sm text-gray-600/70 dark:text-gray-400/70">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Instant Processing</span>
              </div>
            </div>
            <p className="text-sm text-gray-600/80 dark:text-gray-400/80 font-medium">
              Ensure your NIC is valid and your PDF is complete before submitting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}