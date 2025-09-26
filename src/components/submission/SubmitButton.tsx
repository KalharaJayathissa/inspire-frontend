import React from "react";
import { SubmitButtonProps } from "./types";

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitDisabled,
  isUploading,
  file,
  isNicValid,
  isValidatingNic,
}) => {
  return (
    <>
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
                <span className="font-medium">Complete Required Fields</span>
              </>
            ) : (
              <>
                <span className="text-2xl">🚀</span>
                <span className="font-bold tracking-wide">Submit Document</span>
                <span className="text-2xl">✨</span>
              </>
            )}
          </span>
        </button>
      </div>

      {/* Enhanced Status Information */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-600/40">
        <p id="submit-help" className="text-sm font-medium text-center">
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
              <span className="font-semibold">
                Ready to submit your document!
              </span>
              <span className="text-lg animate-pulse">🎉</span>
            </span>
          )}
        </p>
      </div>
    </>
  );
};

export default SubmitButton;
