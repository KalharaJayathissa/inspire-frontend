import React from "react";
import { SubjectSelectionProps } from "./types";

const SubjectSelection: React.FC<SubjectSelectionProps> = ({
  isNicValid,
  selectedSubject,
  selectedPart,
  onSubjectChange,
  onPartChange,
}) => {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isNicValid ? "min-h-[400px] opacity-100" : "min-h-[50px] opacity-30"
      }`}
    >
      {isNicValid ? (
        <div className="space-y-6 transition-all duration-300 ease-out">
          {/* Subject Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-pink-400 dark:to-red-400 mb-3">
              Select Subject
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["Physics", "Chemistry", "Mathematics"].map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => {
                    onSubjectChange(subject);
                    onPartChange(""); // Reset part selection when subject changes
                  }}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                    hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                    ${
                      selectedSubject === subject
                        ? "border-blue-500/60 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-teal-900/30 shadow-[0_8px_32px_rgba(59,130,246,0.25)]"
                        : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-purple-300/50"
                    }
                  `}
                >
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold mb-1 ${
                        selectedSubject === subject
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {subject}
                    </div>
                    {selectedSubject === subject && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Part Selection - Only show when subject is selected */}
          {selectedSubject && (
            <div className="space-y-4 transition-all duration-300 ease-out">
              <label className="block text-sm font-semibold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 mb-3">
                Select Part for {selectedSubject}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedSubject === "Mathematics" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onPartChange("Pure")}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                        ${
                          selectedPart === "Pure"
                            ? "border-teal-500/60 bg-gradient-to-br from-teal-50/50 via-cyan-50/30 to-blue-50/50 dark:from-teal-900/30 dark:via-cyan-900/20 dark:to-blue-900/30 shadow-[0_8px_32px_rgba(20,184,166,0.25)]"
                            : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-teal-300/50"
                        }
                      `}
                    >
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            selectedPart === "Pure"
                              ? "text-teal-700 dark:text-teal-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Part I (Pure)
                        </div>
                        {selectedPart === "Pure" && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
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
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPartChange("Applied")}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                        ${
                          selectedPart === "Applied"
                            ? "border-cyan-500/60 bg-gradient-to-br from-cyan-50/50 via-blue-50/30 to-indigo-50/50 dark:from-cyan-900/30 dark:via-blue-900/20 dark:to-indigo-900/30 shadow-[0_8px_32px_rgba(6,182,212,0.25)]"
                            : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-cyan-300/50"
                        }
                      `}
                    >
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            selectedPart === "Applied"
                              ? "text-cyan-700 dark:text-cyan-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Part II (Applied)
                        </div>
                        {selectedPart === "Applied" && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
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
                        )}
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onPartChange("MCQ")}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                        ${
                          selectedPart === "MCQ"
                            ? "border-green-500/60 bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-teal-50/50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30 shadow-[0_8px_32px_rgba(34,197,94,0.25)]"
                            : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-green-300/50"
                        }
                      `}
                    >
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            selectedPart === "MCQ"
                              ? "text-green-700 dark:text-green-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Part I (MCQ)
                        </div>
                        {selectedPart === "MCQ" && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
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
                        )}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPartChange("Essay")}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 backdrop-blur-md
                        hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg
                        ${
                          selectedPart === "Essay"
                            ? "border-orange-500/60 bg-gradient-to-br from-orange-50/50 via-amber-50/30 to-yellow-50/50 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30 shadow-[0_8px_32px_rgba(249,115,22,0.25)]"
                            : "border-gray-200/40 dark:border-gray-600/40 bg-white/10 dark:bg-gray-800/10 hover:border-orange-300/50"
                        }
                      `}
                    >
                      <div className="text-center">
                        <div
                          className={`text-lg font-semibold mb-1 ${
                            selectedPart === "Essay"
                              ? "text-orange-700 dark:text-orange-300"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Part II (Essay)
                        </div>
                        {selectedPart === "Essay" && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
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
                        )}
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Selection Summary */}
          {selectedSubject && selectedPart && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/30 dark:border-blue-700/30 backdrop-blur-sm transition-all duration-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Selected: {selectedSubject} -{" "}
                  {selectedSubject === "Mathematics"
                    ? `Part ${
                        selectedPart === "Pure" ? "I (Pure)" : "II (Applied)"
                      }`
                    : `Part ${
                        selectedPart === "MCQ" ? "I (MCQ)" : "II (Essay)"
                      }`}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="text-2xl">🔐</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Subject selection will appear after NIC validation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelection;
