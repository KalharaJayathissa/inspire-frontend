import React from "react";

const SubmissionInstructionsCard: React.FC = () => {
  return (
    <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
      <h3 className="text-base font-semibold text-black mb-4 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Submission Instructions
      </h3>

      <div className="space-y-3">
        {/* Step 1 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            1
          </div>
          <div>
            <p className="text-sm text-black font-medium">Enter Valid NIC</p>
            <p className="text-xs text-black/70 mt-1">
              Enter your 12-digit NIC number to verify registration
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            2
          </div>
          <div>
            <p className="text-sm text-black font-medium">
              Select Subject & Part
            </p>
            <p className="text-xs text-black/70 mt-1">
              Choose your subject and the specific part (A or B)
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            3
          </div>
          <div>
            <p className="text-sm text-black font-medium">Upload PDF File</p>
            <p className="text-xs text-black/70 mt-1">
              Upload your answer sheet in PDF format (max 10MB)
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            4
          </div>
          <div>
            <p className="text-sm text-black font-medium">Submit & Confirm</p>
            <p className="text-xs text-black/70 mt-1">
              Review your submission and click submit
            </p>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-black/70">
              Only PDF files accepted
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-black/70">
              Maximum file size: 10MB
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-black/70">
              You can submit each part separately
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionInstructionsCard;
