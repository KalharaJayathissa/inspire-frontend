import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, FileText, Clock, ArrowLeft } from "lucide-react";

interface SubmissionData {
  nic: string;
  subject: string;
  part: string;
  fileName: string;
  timestamp: string;
}

const SubmissionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissionData, setSubmissionData] = useState<SubmissionData | null>(
    null
  );
  const [submissionStatus, setSubmissionStatus] = useState<any>(null);

  useEffect(() => {
    // Get submission data from navigation state
    if (location.state?.submissionData) {
      setSubmissionData(location.state.submissionData);
    }

    // Load submission status to show progress
    const loadSubmissionStatus = async () => {
      try {
        if (submissionData?.nic) {
          // Try to get real submission status from API
          const { getSubmissionStatus } = await import("../lib/api");
          const status = await getSubmissionStatus(submissionData.nic);

          // Transform API response to our expected format
          console.log("Success page API response:", status); // Debug log
          const transformedStatus = {
            subjects: [
              { name: "Physics", parts: ["Part I", "Part II"] },
              { name: "Chemistry", parts: ["Part I", "Part II"] },
              { name: "Mathematics", parts: ["Part I", "Part II"] },
            ],
            submitted:
              status.success && status.data && status.data.submissions
                ? status.data.submissions.map(
                    (sub: any) => `${sub.subject}_${sub.part}`
                  )
                : [],
          };
          setSubmissionStatus(transformedStatus);
        } else {
          // Fallback to showing at least the current submission
          const mockStatus = {
            subjects: [
              { name: "Physics", parts: ["Part I", "Part II"] },
              { name: "Chemistry", parts: ["Part I", "Part II"] },
              { name: "Mathematics", parts: ["Part I", "Part II"] },
            ],
            submitted: submissionData
              ? [`${submissionData.subject}_${submissionData.part}`]
              : [],
          };
          setSubmissionStatus(mockStatus);
        }
      } catch (error) {
        console.error("Error loading submission status:", error);
        // Fallback to showing at least the current submission
        const mockStatus = {
          subjects: [
            { name: "Physics", parts: ["Part I", "Part II"] },
            { name: "Chemistry", parts: ["Part I", "Part II"] },
            { name: "Mathematics", parts: ["Part I", "Part II"] },
          ],
          submitted: submissionData
            ? [`${submissionData.subject}_${submissionData.part}`]
            : [],
        };
        setSubmissionStatus(mockStatus);
      }
    };

    loadSubmissionStatus();
  }, [location.state, submissionData]);

  const getStatusIcon = (subject: string, part: string) => {
    const key = `${subject}_${part}`;
    const isSubmitted = submissionStatus?.submitted.includes(key);

    if (isSubmitted) {
      return (
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Submitted</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-orange-400" />
          <span className="text-xs text-orange-600 font-medium">
            Yet to Submit
          </span>
        </div>
      );
    }
  };

  const calculateProgress = () => {
    if (!submissionStatus) return { percentage: 0, completed: 0, total: 6 };

    const total = submissionStatus.subjects.length * 2; // Each subject has 2 parts
    const completed = submissionStatus.submitted.length;
    const percentage = (completed / total) * 100;

    return { percentage, completed, total };
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Submission Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your document has been uploaded successfully
              </p>
            </div>
          </div>

          {/* Submission Details */}
          {submissionData && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Submission Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Subject
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {submissionData.subject}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Part
                    </label>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      {submissionData.part}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      File Name
                    </label>
                    <p className="text-sm text-gray-800 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {submissionData.fileName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Submitted At
                    </label>
                    <p className="text-sm text-gray-800 dark:text-white">
                      {new Date(submissionData.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submission Progress */}
          {submissionStatus && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Overall Progress
              </h2>

              <div className="space-y-4">
                {submissionStatus.subjects.map((subject: any) => (
                  <div key={subject.name} className="space-y-2">
                    {/* Subject Header */}
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1">
                      {subject.name}
                    </h4>

                    {/* Parts */}
                    <div className="space-y-2 pl-2">
                      {subject.parts.map((part: string) => (
                        <div
                          key={`${subject.name}-${part}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {part}
                            </span>
                          </div>
                          {getStatusIcon(subject.name, part)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Progress:
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {progress.completed > 0
                    ? `Great progress! ${
                        progress.total - progress.completed
                      } more to go.`
                    : "Start submitting your documents to track progress."}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/submissions")}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Submit Another Document
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
