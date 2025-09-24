import React, { useState, useMemo, useEffect } from "react";
import { getstudents } from "../lib/api";

function AdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [activeTab, setActiveTab] = useState("students");

  // School mapping (1-indexed to match the data)
  const schools = [
    "Unknown", // index 0 - fallback
    "Kegalu Vidyalaya", // school_id: 1
    "Kegalu Balika Vidyalaya", // school_id: 2
    "St.Joesph's Balika Vidyalaya", // school_id: 3
    "St.Mary's College", // school_id: 4
    "Dudley Senanayake Central College, Tholangamuwa", // school_id: 5
    "Pinnawala Central College", // school_id: 6
    "Zahira College, Mawanella", // school_id: 7
    "Swarna Jayanthi Maha Vidyalaya", // school_id: 8
    "Ruwanwella Rajasinghe Central College", // school_id: 9
    "Other", // school_id: 10
  ];

  // Utility function to format date and time in Sri Lankan time (Asia/Colombo)
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Format date in Sri Lankan timezone
    const formatDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Colombo",
    });

    // Format time in Sri Lankan timezone
    const formatTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Colombo",
    });

    return { date: formatDate, time: formatTime };
  };

  // Get school name by ID
  const getSchoolName = (schoolId) => {
    return schools[schoolId] || schools[0]; // fallback to 'Unknown'
  };

  // Filter and sort students based on selected school (newest first)
  const filteredStudents = useMemo(() => {
    let filtered = students;
    if (selectedSchool !== "all") {
      filtered = students.filter(
        (student) => student.school_id.toString() === selectedSchool
      );
    }
    // Sort by registration date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.registered_at).getTime() -
        new Date(a.registered_at).getTime()
    );
  }, [students, selectedSchool]);

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
          <div>
            {/* School Filter */}
            {students.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <label
                  htmlFor="school-filter"
                  className="text-gray-900 font-semibold text-sm"
                >
                  Filter by School:
                </label>
                <select
                  id="school-filter"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium hover:border-gray-400 transition-colors min-w-60"
                >
                  <option value="all" className="font-medium text-gray-900">
                    All Schools ({students.length})
                  </option>
                  {schools.slice(1).map((school, index) => {
                    const schoolId = index + 1;
                    const count = students.filter(
                      (s) => s.school_id === schoolId
                    ).length;
                    return (
                      <option
                        key={schoolId}
                        value={schoolId.toString()}
                        className="font-medium text-gray-900 py-1"
                      >
                        {school} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {error && (
              <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
                {error}
              </div>
            )}

            {students.length > 0 && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-black">
                    Students List ({filteredStudents.length} of{" "}
                    {students.length} students)
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-black">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Registration Time
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          NIC
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          School
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Stream
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Exam Location
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Medium
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                          Registration Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => {
                        const { date, time } = formatDateTime(
                          student.registered_at
                        );
                        return (
                          <tr
                            key={student.id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 whitespace-nowrap font-medium">
                              {student.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-xs">
                                <div className="font-medium">{time}</div>
                                <div className="text-gray-500">{date}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {student.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono">
                              {student.NIC}
                            </td>
                            <td className="px-4 py-3">
                              <div
                                className="max-w-xs truncate"
                                title={getSchoolName(student.school_id)}
                              >
                                {getSchoolName(student.school_id)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div
                                className="max-w-xs truncate"
                                title={student.contact_email}
                              >
                                {student.contact_email}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {student.contact_phone}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                {student.shy}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap capitalize">
                              {student.gender}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {student.subject_stream}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                {student.exam_location}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {student.medium}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {date}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredStudents.length === 0 && selectedSchool !== "all" && (
                  <div className="text-center py-8 text-gray-500">
                    No students found for the selected school.
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="text-center py-8 text-gray-500">
                Loading students...
              </div>
            )}

            {students.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No students found.
              </div>
            )}
          </div>
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
