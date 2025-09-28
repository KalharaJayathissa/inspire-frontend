import React, { useEffect, useState } from "react";
import { getSubmissionStatus } from "../../lib/api";
import { CheckCircle, Clock, Loader2 } from "lucide-react";

interface SubmissionStatusCardProps {
  nicNumber?: string;
}

interface SubmissionData {
  id: number;
  nic: string;
  subject: string;
  part: string;
  submission_date: string;
  file_path: string;
  generated_filename: string;
}

const SubmissionStatusCard: React.FC<SubmissionStatusCardProps> = ({
  nicNumber,
}) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define subjects and their parts
  const subjects = [
    { name: "Physics", parts: ["Part I", "Part II"] },
    { name: "Chemistry", parts: ["Part I", "Part II"] },
    { name: "Mathematics", parts: ["Part I", "Part II"] },
  ];

  useEffect(() => {
    if (nicNumber) {
      fetchSubmissionStatus();
    }
  }, [nicNumber]);

  const fetchSubmissionStatus = async () => {
    if (!nicNumber) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getSubmissionStatus(nicNumber);
      console.log("Submission status API response:", response); // Debug log

      if (response.success && response.data && response.data.submissions) {
        console.log("Setting submissions:", response.data.submissions);
        setSubmissions(response.data.submissions);
      } else {
        console.log("No submissions found or invalid response structure");
        setSubmissions([]);
      }
    } catch (error: any) {
      console.error("Error fetching submission status:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // More specific error messages
      if (error.response?.status === 404) {
        setError("Submission status endpoint not found");
      } else if (error.response?.status === 500) {
        setError("Server error while fetching submissions");
      } else if (error.code === "ECONNREFUSED") {
        setError("Backend server is not running");
      } else {
        setError("Failed to load submission status");
      }
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const isSubmitted = (subject: string, part: string) => {
    return submissions.some(
      (submission) =>
        submission.subject.toLowerCase() === subject.toLowerCase() &&
        submission.part === part
    );
  };

  const calculateProgress = () => {
    const totalPapers = subjects.length * 2; // Each subject has 2 parts
    const submittedPapers = submissions.length;
    const percentage =
      totalPapers > 0 ? (submittedPapers / totalPapers) * 100 : 0;
    return { percentage, submitted: submittedPapers, total: totalPapers };
  };

  const progress = calculateProgress();

  return (
    <div className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-black">
          Submission Status
        </h3>
        <div className="flex items-center space-x-2">
          {nicNumber && (
            <button
              onClick={fetchSubmissionStatus}
              disabled={loading}
              className="p-1 rounded-full hover:bg-white/20 transition-colors disabled:opacity-50"
              title="Refresh submission status"
            >
              <svg
                className={`w-4 h-4 text-gray-600 ${
                  loading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}
          {loading && (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!nicNumber && (
        <div className="text-center py-8">
          <p className="text-sm text-black/60">
            Enter a valid NIC to see submission status
          </p>
        </div>
      )}

      {nicNumber && (
        <>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="space-y-2">
                {/* Subject Header */}
                <h4 className="text-sm font-medium text-black/80 border-b border-white/20 pb-1">
                  {subject.name}
                </h4>

                {/* Parts */}
                <div className="space-y-2 pl-2">
                  {subject.parts.map((part) => {
                    const submitted = isSubmitted(subject.name, part);
                    return (
                      <div
                        key={`${subject.name}-${part}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              submitted ? "bg-green-500" : "bg-orange-500"
                            }`}
                          ></div>
                          <span className="text-xs text-black/70">{part}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {submitted ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">
                                Submitted
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 text-orange-400" />
                              <span className="text-xs text-orange-600 font-medium">
                                Yet to Submit
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress.percentage > 0
                        ? "bg-gradient-to-r from-green-400 to-blue-500"
                        : "bg-orange-400"
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-black/70 font-medium">
                  {progress.submitted}/{progress.total}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubmissionStatusCard;
