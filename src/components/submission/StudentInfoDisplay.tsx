import React from "react";
import { StudentInfo } from "./types";

interface StudentInfoDisplayProps {
  studentInfo: StudentInfo | null;
  isFetchingStudent: boolean;
  isNicValid: boolean | null;
}

const StudentInfoDisplay: React.FC<StudentInfoDisplayProps> = ({
  studentInfo,
  isFetchingStudent,
  isNicValid,
}) => {
  // Only show if NIC is valid or we're fetching student info
  if (!isNicValid && !isFetchingStudent) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 dark:border-white/10">
      {isFetchingStudent ? (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-black">
            Loading student information...
          </span>
        </div>
      ) : studentInfo ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-black font-medium">
              {studentInfo.fullName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <span className="text-xs text-black/70">
              NIC: {studentInfo.nicNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
            <span className="text-xs text-black/70">
              Phone: {studentInfo.mobileNumber}
            </span>
          </div>
          {studentInfo.school && (
            <div className="flex items-center space-x-2">
              <div
                className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <span className="text-xs text-black/70">
                School: {studentInfo.school}
              </span>
            </div>
          )}
        </div>
      ) : isNicValid ? (
        <div className="text-center py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
          <span className="text-sm text-black">NIC verified</span>
        </div>
      ) : null}
    </div>
  );
};

export default StudentInfoDisplay;
