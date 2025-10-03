import React from "react";
import { useNavigate } from "react-router-dom";

const ExamPapersAccessCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative group">
      {/* Outer Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>

      {/* Main Exam Papers Card */}
      <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-white/10 shadow-xl">
        <div className="text-center space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Need Exam Papers?
            </h3>
            <p className="text-sm text-gray-700/80 dark:text-gray-300/80 font-medium leading-relaxed">
              Download official KESS exam papers for practice and preparation!
            </p>
          </div>

          {/* Exam Papers Button */}
          <button
            onClick={() => navigate("/exam-papers")}
            className="
              relative w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 overflow-hidden
              bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white
              hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
              hover:shadow-[0_15px_35px_rgba(99,102,241,0.4)] 
              hover:scale-105 hover:-translate-y-1
              focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
              shadow-[0_6px_24px_rgba(31,38,135,0.25)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)]
              border border-white/20 dark:border-gray-700/50
            "
          >
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="font-bold tracking-wide">View Exam Papers</span>
            </span>
          </button>

          {/* Additional Info */}
          <div className="pt-2 space-y-1">
            <div className="text-xs text-gray-600 dark:text-gray-400">
              📚 Chemistry, Math & Physics
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              📄 High-Quality PDF Downloads
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPapersAccessCard;
