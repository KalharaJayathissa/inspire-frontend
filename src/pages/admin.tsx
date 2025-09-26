import React, { useState, useEffect } from "react";
import { getstudents } from "../lib/api";
import StudentDetailsTab from "../components/StudentDetailsTab";

function AdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("students");

  const handleGetStudents = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching students...");
      const data = await getstudents();
      console.log("Students data received:", data);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load students when component mounts
  useEffect(() => {
    handleGetStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-black">Admin Dashboard</h1>
        <p className="text-black mb-6">Welcome, Admin! </p>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("students")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "students"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Student Details
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "students" && (
          <StudentDetailsTab
            students={students}
            loading={loading}
            error={error}
          />
        )}

        {activeTab === "analytics" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Analytics</h2>
            <p className="text-gray-600">Analytics features coming soon...</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-black mb-4">Settings</h2>
            <p className="text-gray-600">Settings features coming soon...</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;
