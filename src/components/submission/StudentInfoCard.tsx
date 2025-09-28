import React from "react";
import { StudentInfoCardProps } from "./types";

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  studentInfo,
  isFetchingStudent,
  isNicValid,
  className = "hidden lg:block",
}) => {
  return (
    <div
      className={`${className} relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl`}
    >
      <h3 className="text-base font-semibold text-black mb-3">
        Student Information
      </h3>
      {isFetchingStudent ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-xs text-black">Loading...</span>
        </div>
      ) : studentInfo ? (
        <div className="space-y-2">
          {studentInfo.fullName && (
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black">
                Name: {studentInfo.fullName}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-black">
              NIC: {studentInfo.nicNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <span className="text-xs text-black">
              Phone: {studentInfo.mobileNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <span className="text-xs text-black">
              School: {studentInfo.school}
            </span>
          </div>
        </div>
      ) : isNicValid ? (
        <div className="text-center py-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
          <span className="text-xs text-black">NIC verified</span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-black">Enter valid NIC</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            <span className="text-xs text-black">Student info will appear</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInfoCard;
