import React from "react";
import { DocumentSubmissionCardProps } from "./types";

const DocumentSubmissionCard: React.FC<DocumentSubmissionCardProps> = () => {
  return (
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
  );
};

export default DocumentSubmissionCard;
