import React from "react";

const SubmissionStatusCard: React.FC = () => {
  // Define subjects and their parts
  const subjects = [
    { name: "Physics", parts: ["Part A", "Part B"] },
    { name: "Chemistry", parts: ["Part A", "Part B"] },
    { name: "Combined Maths", parts: ["Part A", "Part B"] },
  ];

  return (
    <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
      <h3 className="text-base font-semibold text-black mb-4">
        Submission Status
      </h3>

      <div className="space-y-4">
        {subjects.map((subject, subjectIndex) => (
          <div key={subject.name} className="space-y-2">
            {/* Subject Header */}
            <h4 className="text-sm font-medium text-black/80 border-b border-white/20 pb-1">
              {subject.name}
            </h4>

            {/* Parts */}
            <div className="space-y-2 pl-2">
              {subject.parts.map((part, partIndex) => (
                <div
                  key={`${subject.name}-${part}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-black/70">{part}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-orange-600 font-medium">
                      Yet to Submit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-black/60">Total Progress:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-400 h-2 rounded-full"
                style={{ width: "0%" }}
              ></div>
            </div>
            <span className="text-xs text-black/70 font-medium">0/6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionStatusCard;
