import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundImg from "@/assets/Background.jpg";
import {
  ToastSystem,
  NicInput,
  SubjectSelection,
  FileUpload,
  SubmitButton,
  StudentInfoCard,
  NicNotFoundModal,
  DocumentSubmissionCard,
  FormProgressCard,
  SubmissionStatusCard,
  StudentInfoDisplay,
  SubmissionInstructionsCard,
  useToasts,
  useNicValidation,
  useFileUpload,
  StudentInfo,
  Toast,
} from "@/components/submission";
import { submitDocument, submitDocumentMock } from "@/lib/api";

// Toggle this to use mock function when backend is not ready
const USE_MOCK_SUBMISSION = false;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SubmissionsPage(): JSX.Element {
  const navigate = useNavigate();

  // State management
  const [nic, setNic] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<string>("");
  const [showNicNotFoundModal, setShowNicNotFoundModal] = useState(false);

  // Handle NIC not found
  const handleNicNotFound = () => {
    setShowNicNotFoundModal(true);
  };

  // Custom hooks
  const { toasts, addToast, removeToast } = useToasts();
  const nicValidation = useNicValidation(addToast, handleNicNotFound);
  const fileUpload = useFileUpload(addToast);

  // Additional refs not provided by hooks
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate if submit is disabled
  const isSubmitDisabled =
    !fileUpload.file ||
    nicValidation.isNicValid !== true ||
    !selectedSubject ||
    !selectedPart ||
    nicValidation.isValidatingNic;

  // Handle NIC change with validation
  const handleNicChange = (value: string) => {
    setNic(value);
    nicValidation.clearNicValidation();
    if (value.length === 12) {
      nicValidation.debouncedValidateNic(value);
    }
  };

  // Handle subject change
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  // Handle part change
  const handlePartChange = (part: string) => {
    setSelectedPart(part);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        addToast("error", "Please select a PDF file only");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        addToast("error", "File size must be less than 10MB");
        return;
      }
      fileUpload.handleFileChange(selectedFile);
      addToast("success", `File "${selectedFile.name}" selected successfully`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      addToast("error", "Please complete all required fields");
      return;
    }

    try {
      fileUpload.setIsUploading(true);
      fileUpload.setUploadProgress(0);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", fileUpload.file!);
      formData.append("nic", nic);
      formData.append("subject", selectedSubject.toLowerCase());
      // Convert "Part I" to "parti" and "Part II" to "partii"
      const partForBackend = selectedPart.replace(/\s+/g, "").toLowerCase();
      formData.append("part", partForBackend);

      // Add student info if available
      if (nicValidation.studentInfo) {
        formData.append(
          "studentName",
          nicValidation.studentInfo.fullName || ""
        );
        formData.append(
          "mobileNumber",
          nicValidation.studentInfo.mobileNumber || ""
        );
        formData.append("school", nicValidation.studentInfo.school || "");
      }

      addToast("info", "Uploading document...");

      // Choose submission function based on mock setting
      const submissionFunction = USE_MOCK_SUBMISSION
        ? submitDocumentMock
        : submitDocument;

      if (USE_MOCK_SUBMISSION) {
        addToast("info", "Running in demo mode - no actual backend submission");
      }

      // Submit using the chosen API service with progress callback
      const result = await submissionFunction(formData, (progress: number) => {
        fileUpload.setUploadProgress(progress);
      });

      fileUpload.setUploadProgress(100);

      if (result.success) {
        addToast(
          "success",
          result.message || "Document submitted successfully!"
        );

        // Reset form
        setNic("");
        nicValidation.clearNicValidation();
        setSelectedSubject("");
        setSelectedPart("");
        fileUpload.handleFileChange(null);

        // Navigate to success page
        setTimeout(() => {
          navigate("/submissions/success");
        }, 2000);
      } else {
        addToast("error", result.message || "Failed to submit document");
      }
    } catch (error: any) {
      console.error("Upload error:", error);

      // Enhanced error handling
      if (error.status === 0) {
        addToast(
          "error",
          "Backend server is not running. Using demo mode instead."
        );
        addToast("info", "Switch to demo mode by enabling USE_MOCK_SUBMISSION");
      } else if (error.status === 400) {
        addToast(
          "error",
          "Invalid request format: " + (error.message || "Bad Request")
        );
      } else if (error.status === 404) {
        addToast(
          "error",
          "Submission endpoint not found. Backend may not be properly configured."
        );
      } else if (error.status === 500) {
        addToast(
          "error",
          "Server error: " + (error.message || "Internal Server Error")
        );
      } else if (error.message) {
        addToast("error", error.message);
      } else {
        addToast(
          "error",
          "Network error. Please try again or contact support."
        );
      }
    } finally {
      fileUpload.setIsUploading(false);
      fileUpload.setUploadProgress(0);
    }
  };

  const handleTryAgain = () => {
    setShowNicNotFoundModal(false);
    setNic("");
    nicValidation.clearNicValidation();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${BackgroundImg})`,
      }}
    >
      {/* Toast System */}
      <ToastSystem toasts={toasts} onRemoveToast={removeToast} />

      {/* NIC Not Found Modal */}
      <NicNotFoundModal
        isOpen={showNicNotFoundModal}
        onClose={() => setShowNicNotFoundModal(false)}
        onTryAgain={handleTryAgain}
      />

      {/* Main Content */}
      <div className="relative min-h-screen py-8 lg:py-12">
        {/* Enhanced Glass Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20"></div>

        {/* Main Container */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Left Column: Information & Status (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              {/* Document Submission Card */}
              <DocumentSubmissionCard />

              {/* Progress Indicators */}
              <FormProgressCard
                isNicValid={nicValidation.isNicValid}
                selectedSubject={selectedSubject}
                selectedPart={selectedPart}
                file={fileUpload.file}
                isValidatingNic={nicValidation.isValidatingNic}
              />

              {/* Submission Instructions */}
              <SubmissionInstructionsCard />
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
                    {/* NIC Input Component */}
                    <NicInput
                      nic={nic}
                      onNicChange={handleNicChange}
                      isNicValid={nicValidation.isNicValid}
                      isValidatingNic={nicValidation.isValidatingNic}
                    />

                    {/* Student Information Display - Below NIC Input */}
                    <StudentInfoDisplay
                      studentInfo={nicValidation.studentInfo}
                      isFetchingStudent={nicValidation.isFetchingStudent}
                      isNicValid={nicValidation.isNicValid}
                    />

                    {/* Subject Selection Component */}
                    <SubjectSelection
                      isNicValid={nicValidation.isNicValid}
                      selectedSubject={selectedSubject}
                      selectedPart={selectedPart}
                      onSubjectChange={handleSubjectChange}
                      onPartChange={handlePartChange}
                    />

                    {/* File Upload Component */}
                    <FileUpload
                      file={fileUpload.file}
                      isDragOver={fileUpload.isDragOver}
                      fileInputRef={fileInputRef}
                      onFileChange={handleFileChange}
                      onDragOver={fileUpload.handleDragOver}
                      onDragLeave={fileUpload.handleDragLeave}
                      onDrop={fileUpload.handleDrop}
                    />

                    {/* Upload Progress Card - Mobile Only (below PDF upload) */}
                    <div className="lg:hidden">
                      <FormProgressCard
                        isNicValid={nicValidation.isNicValid}
                        selectedSubject={selectedSubject}
                        selectedPart={selectedPart}
                        file={fileUpload.file}
                        isValidatingNic={nicValidation.isValidatingNic}
                      />
                    </div>

                    {/* Submit Button Component */}
                    <SubmitButton
                      isSubmitDisabled={isSubmitDisabled}
                      isUploading={fileUpload.isUploading}
                      file={fileUpload.file}
                      isNicValid={nicValidation.isNicValid}
                      isValidatingNic={nicValidation.isValidatingNic}
                    />
                  </form>
                </div>
              </div>

              {/* Mobile-only Submission Status Card */}
              <div className="lg:hidden mt-8">
                <SubmissionStatusCard />
              </div>

              {/* Mobile-only Register Now Card */}
              <div className="lg:hidden mt-8">
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
                          Join KESS INSPIRE 2025 and participate in the
                          competition!
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
                        {/* Button content */}
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span className="font-bold tracking-wide">
                            Register Now
                          </span>
                        </span>
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

            {/* Right Column: Registration (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-3 space-y-4">
              {/* Submission Status */}
              <SubmissionStatusCard />

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
                        Join KESS INSPIRE 2025 and participate in the
                        competition!
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
                      {/* Button content */}
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="font-bold tracking-wide">
                          Register Now
                        </span>
                      </span>
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
              <p className="text-sm text-white font-medium">
                © All right reserved. Kegalle Engineering Students' Society
                (KESS)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
