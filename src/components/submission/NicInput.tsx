import React from 'react';
import { NicInputProps } from './types';

const NicInput: React.FC<NicInputProps> = ({
  nic,
  onNicChange,
  isNicValid,
  isValidatingNic
}) => {
  return (
    <div className="group/input space-y-6">
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
            onChange={(e) => onNicChange(e.target.value)}
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
  );
};

export default NicInput;