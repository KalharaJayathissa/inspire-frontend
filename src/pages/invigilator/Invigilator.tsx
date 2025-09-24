import React, { useState, useEffect } from "react";
import { SchoolSelection } from "@/components/Attendent/school-selection";
import { AttendanceSearch } from "@/components/Attendent/attendance-search";
import { RegisterStudent } from "@/components/Attendent/register-student";
import { toast } from "sonner";
import { getTodaysAttendance } from "@/lib/api";
import "./invigilator.css";

interface Student {
  student_school_id: number;
  student_id: number;
  student_name: string;
  student_nic: string;
  contact_email: string;
  contact_phone: string;
  registered_at: string;
  attendance_status: number;
  marked_by: string;
  marked_at: string;
}

type Page = "schools" | "search" | "register";

function Invigilator() {
  const [currentPage, setCurrentPage] = useState<Page>("schools");
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>("");
  const [presentStudents, setPresentStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Force light theme when component mounts
  useEffect(() => {
    // Store original styles
    const originalBodyStyle = document.body.style.cssText;
    const originalHtmlStyle = document.documentElement.style.cssText;

    // Apply light theme to document
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.color = "#0f172a";
    document.documentElement.style.colorScheme = "light";

    // Apply CSS variables override to root
    const root = document.documentElement;
    root.style.setProperty("--background", "0 0% 100%");
    root.style.setProperty("--foreground", "0 0% 3.9%");
    root.style.setProperty("--card", "0 0% 100%");
    root.style.setProperty("--card-foreground", "0 0% 3.9%");
    root.style.setProperty("--muted", "0 0% 96.1%");
    root.style.setProperty("--muted-foreground", "0 0% 45.1%");
    root.style.setProperty("--border", "0 0% 89.8%");

    // Cleanup function to restore original styles
    return () => {
      document.body.style.cssText = originalBodyStyle;
      document.documentElement.style.cssText = originalHtmlStyle;
    };
  }, []);

  const handleSelectSchool = (schoolId: number, schoolName: string) => {
    setSelectedSchoolId(schoolId);
    setSelectedSchoolName(schoolName);
    setCurrentPage("search");
    // Load today's attendance for this school
    loadTodaysAttendance(schoolId);
  };

  const loadTodaysAttendance = async (schoolId: number) => {
    try {
      setLoading(true);
      console.log("Loading attendance for school ID:", schoolId);
      const attendanceData = await getTodaysAttendance(schoolId);
      console.log("Raw attendance data received:", attendanceData);

      // Check if attendanceData is an array
      if (!Array.isArray(attendanceData)) {
        console.error("Attendance data is not an array:", attendanceData);
        setPresentStudents([]);
        return;
      }

      // Filter only present students (status = 1)
      const presentStudentsData = attendanceData.filter(
        (student: Student) => student.attendance_status === 1
      );
      console.log("Present students filtered:", presentStudentsData);
      setPresentStudents(presentStudentsData);
    } catch (error: any) {
      toast.error("Failed to load attendance data");
      console.error("Failed to load attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  // These handlers will be implemented in the child components
  // since they need to make API calls with the attendance system
  const refreshAttendance = () => {
    if (selectedSchoolId) {
      loadTodaysAttendance(selectedSchoolId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "schools":
        return <SchoolSelection onSelectSchool={handleSelectSchool} />;
      case "search":
        return (
          <AttendanceSearch
            selectedSchoolId={selectedSchoolId!}
            selectedSchoolName={selectedSchoolName}
            onRegisterClick={() => setCurrentPage("register")}
            onBackToSchools={() => setCurrentPage("schools")}
            presentStudents={presentStudents}
            refreshAttendance={refreshAttendance}
            loading={loading}
          />
        );
      case "register":
        return (
          <RegisterStudent
            selectedSchoolId={selectedSchoolId!}
            selectedSchoolName={selectedSchoolName}
            onBack={() => setCurrentPage("search")}
            onRegistrationSuccess={refreshAttendance}
            presentStudents={presentStudents}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
      className="invigilator-theme min-h-screen"
      style={{
        backgroundColor: "#ffffff",
        color: "#0f172a",
        minHeight: "100vh",
        colorScheme: "light",
      }}
    >
      {renderPage()}
    </div>
  );
}

export default Invigilator;
