import React from "react";
import { FormProgressCardProps } from "./types";

const FormProgressCard: React.FC<FormProgressCardProps> = ({
  isNicValid,
  selectedSubject,
  selectedPart,
  file,
  isValidatingNic,
}) => {
  const isSubmitDisabled =
    !file || isNicValid !== true || !selectedSubject || !selectedPart;

  return (
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
  );
};

export default FormProgressCard;
