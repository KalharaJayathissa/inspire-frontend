import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  BookOpen,
  Atom,
  Calculator,
  User,
  Award,
  Edit2,
  Check,
  X,
  Trash2,
  UserCircle,
  ChevronUp,
} from "lucide-react";
import {
  addMarks,
  updateMarks,
  getMarks,
  deleteMarks,
  getAllStudents,
  SUBJECT_CODES,
  setupTokenMonitoring,
  type MarkRecord,
} from "@/services/api";

const SubjectPage = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [studentId, setStudentId] = useState("");
  const [marks, setMarks] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [marksList, setMarksList] = useState<MarkRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<MarkRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  // Autocomplete states
  const [allStudentNICs, setAllStudentNICs] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [isLoadingNICs, setIsLoadingNICs] = useState(false);

  // Inline editing states
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editingMarks, setEditingMarks] = useState<number | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MarkRecord | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const marksInputRef = useRef<HTMLInputElement>(null);

  // Scroll to top state
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Debug effect to track marksList changes
  useEffect(() => {
    // console.log('📊 marksList changed:', marksList);
    // console.log('📊 marksList length:', marksList.length);
    // console.log('📊 marksList items:', marksList.map(m => `${m.student_id}: ${m.marks}`));
  }, [marksList]);

  useEffect(() => {
    const checkAuthAndLoadMarks = async () => {
      // console.log('useEffect triggered - checking auth and fetching marks');

      // console.log('🔍 SubjectPage: Checking authentication for subject:', subject);

      // Development mode: Skip authentication for testing
      if (import.meta.env.MODE === "development") {
        //console.log('🚧 DEVELOPMENT MODE: Bypassing authentication check in SubjectPage');
        const email = localStorage.getItem("user_email") || "marker@kess.com";
        setUserEmail(email);
        await Promise.all([loadInitialMarks(), loadAllNICs()]);
        return;
      }

      const token = localStorage.getItem("access_token");
      const email = localStorage.getItem("user_email");

      // console.log('🔑 SubjectPage - Checking stored credentials:');
      // console.log('  - Token exists:', !!token);
      // console.log('  - Email exists:', !!email);

      if (!token || !email) {
        //console.log('❌ SubjectPage: Missing credentials, redirecting to login');
        navigate("/login");
        return;
      }

      try {
        //console.log('✅ SubjectPage: Credentials found, loading initial marks for subject:', subject);
        // Get user email from localStorage
        const email = localStorage.getItem("user_email") || "marker@kess.com";
        setUserEmail(email);
        // Load initial marks and all NICs - this will also validate the token
        await Promise.all([loadInitialMarks(), loadAllNICs()]);
        //console.log('✅ SubjectPage: Successfully loaded marks and NICs');
      } catch (error: any) {
        // If token validation fails during API call, redirect to login
        //console.log('❌ SubjectPage: Error during API calls:', error);
        if (
          error.message?.includes("401") ||
          error.message?.includes("Unauthorized")
        ) {
          //console.log('❌ SubjectPage: Token validation failed (401/Unauthorized), redirecting to login');
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_email");
          navigate("/login");
        } // else {
        //console.log('⚠️ SubjectPage: Non-auth error, continuing but data may be incomplete');
        //}
      }
    };

    checkAuthAndLoadMarks();

    // Setup token monitoring for automatic expiration handling
    const stopMonitoring = setupTokenMonitoring(2); // Check every 2 minutes

    // Cleanup monitoring when component unmounts
    return () => {
      stopMonitoring();
    };
  }, [navigate, subject]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButton(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const loadInitialMarks = async () => {
    //console.log('=== LOADING INITIAL MARKS ===');
    setIsLoading(true);

    try {
      const subjectId = getSubjectCode();
      //console.log('Subject ID:', subjectId);

      // Make API call
      //console.log('Making API call to getMarks...');
      const response = await getMarks(subjectId);

      // console.log('=== API RESPONSE ===');
      // console.log('Full response:', JSON.stringify(response, null, 2));
      // console.log('Response.allMarks:', response.allMarks);
      // console.log('Response.allMarks type:', typeof response.allMarks);
      // console.log('Response.allMarks is Array:', Array.isArray(response.allMarks));
      // console.log('Response.allMarks length:', response.allMarks?.length || 'undefined');
      // console.log('Response.totalCount:', response.totalCount);

      // Set the marks list using allMarks field
      const marksArray = response.allMarks || [];
      //console.log('Setting marksList to:', marksArray);
      setMarksList(marksArray);

      // console.log('=== MARKS SET SUCCESSFULLY ===');
      // console.log('Final marksList should have:', marksArray.length, 'items');
    } catch (error: any) {
      console.error("=== ERROR LOADING MARKS ===");
      console.error("Error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      setMarksList([]);
    } finally {
      setIsLoading(false);
      //console.log('=== LOADING COMPLETE ===');
    }
  };

  const loadAllNICs = async () => {
    // console.log('=== LOADING ALL STUDENT NICs ===');
    // console.log('🔄 Always fetching fresh NICs from database on page load');
    setIsLoadingNICs(true);

    try {
      // Always fetch fresh data from API - no mock data fallback
      // console.log('🌐 Calling getAllStudents API...');
      // console.log('🌐 API Endpoint: http://localhost:3000/api/marker/getAllStudents');
      // console.log('🌐 Token available:', !!localStorage.getItem('access_token'));

      const response = await getAllStudents();
      // console.log('✅ All students response:', response);
      // console.log('📊 All NICs from database:', response.nics);
      // console.log('📊 Response type:', typeof response);
      // console.log('📊 Response keys:', Object.keys(response));

      const nicsToStore = response.nics || [];
      setAllStudentNICs(nicsToStore);
      // console.log('=== FRESH NICs LOADED SUCCESSFULLY ===');
      // console.log('Total NICs loaded from database:', nicsToStore.length);
      // console.log('Sample NICs:', nicsToStore.slice(0, 5));

      // Always store fresh NICs in localStorage for current session filtering
      if (nicsToStore.length > 0) {
        const currentTime = Date.now();
        localStorage.setItem("student_nics", JSON.stringify(nicsToStore));
        localStorage.setItem("student_nics_timestamp", currentTime.toString());
        // console.log('💾 Fresh NICs stored in localStorage for current session');
        // console.log('💾 Stored', nicsToStore.length, 'NICs at:', new Date(currentTime).toLocaleString());
        // console.log('📋 NICs ready for instant filtering during this session');
        // No success notification - loading student data should be silent
      } else {
        // Show warning if no NICs found - this is important for user to know
        toast({
          title: "⚠️ No Student Data Found",
          description:
            "No student NICs were found in the database. Manual entry is still available.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("=== ERROR LOADING NICs ===");
      console.error("Error object:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);

      // Check if it's a network error
      if (error.message?.includes("fetch")) {
        console.error("🌐 NETWORK ERROR: Could not connect to backend server");
        console.error(
          "🌐 Make sure your backend server is running on http://localhost:3000"
        );
      }

      setAllStudentNICs([]);

      // Show detailed error message in RED
      toast({
        title: "❌ Error Loading Student Data",
        description: `Could not load student NICs: ${error.message}. Please check your connection and try again.`,
        variant: "destructive", // This shows in red/error style
      });
    } finally {
      setIsLoadingNICs(false);
      //console.log('=== NICs LOADING COMPLETE ===');
    }
  };

  const fetchAllMarks = async () => {
    try {
      //console.log('Fetching marks for refresh...');
      setIsLoading(true);
      const subjectId = getSubjectCode();
      const response = await getMarks(subjectId);

      //console.log('Refresh marks response:', response);
      setMarksList(response.allMarks || []);
    } catch (error: any) {
      console.error("Error fetching marks:", error);
      setMarksList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubjectIcon = () => {
    switch (subject?.toLowerCase()) {
      case "physics":
        return <Atom className="w-6 h-6" />;
      case "chemistry":
        return <BookOpen className="w-6 h-6" />;
      case "combined maths":
        return <Calculator className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  const getSubjectColor = () => {
    switch (subject?.toLowerCase()) {
      case "physics":
        return "bg-black";
      case "chemistry":
        return "bg-gray-800";
      case "combined maths":
        return "bg-gray-700";
      default:
        return "bg-gray-600";
    }
  };

  const getSubjectCode = () => {
    const subjectKey = subject?.toLowerCase() as keyof typeof SUBJECT_CODES;
    const subjectCode = SUBJECT_CODES[subjectKey] || 1;
    // console.log('🔢 getSubjectCode Debug:');
    // console.log('  - subject param:', subject);
    // console.log('  - subjectKey (lowercased):', subjectKey);
    // console.log('  - SUBJECT_CODES mapping:', SUBJECT_CODES);
    // console.log('  - resolved subjectCode:', subjectCode);
    return subjectCode;
  };

  const handleSubmitMarks = async () => {
    if (!studentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter the student ID",
        variant: "destructive",
      });
      return;
    }

    if (marks === "" || marks < 0 || marks > 100) {
      toast({
        title: "Error",
        description: "Please enter valid marks (0-100)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectId = getSubjectCode();
      const response = await addMarks(studentId, Number(marks), subjectId);

      // console.log('Add marks response:', response);
      // console.log('All marks from response:', response.allMarks);

      // Backend returns { message, newMarks, allMarks, totalCount }
      if (response.newMarks) {
        toast({
          title: "Success",
          description: response.message || "Marks added successfully!",
        });

        // Update the table with all marks from response
        setMarksList(response.allMarks || []);

        // Clear the form
        setStudentId("");
        setMarks("");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to add marks",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error adding marks:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add marks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMarks = (record: MarkRecord) => {
    setEditingRecord(record);
    setStudentId(record.student_id);
    setMarks(""); // Keep marks field empty - user must re-enter
  };

  const handleUpdateMarks = async () => {
    if (!editingRecord) return;

    if (!studentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter the student ID",
        variant: "destructive",
      });
      return;
    }

    if (marks === "" || marks < 0 || marks > 100) {
      toast({
        title: "Error",
        description: "Please enter valid marks (0-100)",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectId = getSubjectCode();
      //console.log('Calling updateMarks with:', { studentId, marks: Number(marks), subjectId });

      const response = await updateMarks(studentId, Number(marks), subjectId);

      // console.log('=== UPDATE MARKS RESPONSE ===');
      // console.log('Full response:', JSON.stringify(response, null, 2));
      // console.log('response.updatedMarks:', response.updatedMarks);
      // console.log('response.allMarks:', response.allMarks);
      // console.log('response.message:', response.message);

      if (response.updatedMarks) {
        //console.log('✅ Update successful, showing toast and updating table');
        toast({
          title: "Success",
          description: response.message || "Marks updated successfully!",
        });

        // Update table with all marks from response (no need for extra API call)
        //console.log('Setting marksList with', response.allMarks?.length || 0, 'items');
        setMarksList(response.allMarks || []);

        // Clear the form and edit state
        setStudentId("");
        setMarks("");
        setEditingRecord(null);
      } else {
        console.error("❌ No updatedMarks in response");
      }
    } catch (error: any) {
      console.error("Error updating marks:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update marks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingRecord(null);
    setStudentId("");
    setMarks("");
  };

  // Inline editing functions
  const handleInlineEdit = (record: MarkRecord) => {
    setEditingRowId(record.id);
    setEditingMarks(record.marks);
  };

  const handleInlineSave = async (record: MarkRecord) => {
    if (editingMarks === "" || editingMarks < 0 || editingMarks > 100) {
      toast({
        title: "Error",
        description: "Please enter valid marks (0-100)",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const subjectId = getSubjectCode();
      // console.log('Inline update - calling updateMarks with:',
      // {
      //   studentId: record.student_id,
      //   marks: Number(editingMarks),
      //   subjectId
      // });

      const response = await updateMarks(
        record.student_id,
        Number(editingMarks),
        subjectId
      );

      // console.log('=== INLINE UPDATE RESPONSE ===');
      // console.log('Full response:', JSON.stringify(response, null, 2));

      if (response.updatedMarks) {
        //console.log('✅ Inline update successful');

        toast({
          title: "Success",
          description: `Marks updated successfully for ${record.student_id}`,
        });

        // Update the local state
        if (response.allMarks && Array.isArray(response.allMarks)) {
          setMarksList(response.allMarks);
        }

        // Clear inline editing state
        setEditingRowId(null);
        setEditingMarks("");
      }
    } catch (error: any) {
      console.error("❌ Inline update failed:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to update marks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInlineCancel = () => {
    setEditingRowId(null);
    setEditingMarks("");
  };

  const handleDeleteClick = (record: MarkRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;

    setIsDeleting(recordToDelete.id);
    setDeleteDialogOpen(false);

    try {
      const subjectId = getSubjectCode();
      //console.log('Delete marks - calling deleteMarks with:', {
      //   studentId: recordToDelete.student_id,
      //   subjectId
      // });

      const response = await deleteMarks(recordToDelete.student_id, subjectId);

      // console.log('=== DELETE MARKS RESPONSE ===');
      // console.log('Full response:', JSON.stringify(response, null, 2));
      // console.log('Response has deletedMarks:', !!response.deletedMarks);
      // console.log('Response has remainingMarks:', !!response.remainingMarks);
      // console.log('RemainingMarks is array:', Array.isArray(response.remainingMarks));
      // console.log('RemainingMarks length:', response.remainingMarks?.length || 'undefined');

      // Check if delete was successful (either deletedMarks exists or we got a success message)
      if (response.deletedMarks || response.message) {
        //console.log('✅ Delete successful');

        toast({
          title: "Success",
          description: `Marks deleted successfully for ${recordToDelete.student_id}`,
        });

        // Update the local state with response remainingMarks
        if (response.remainingMarks && Array.isArray(response.remainingMarks)) {
          //console.log('📝 Updating marksList with response.remainingMarks');
          setMarksList(response.remainingMarks);
        } else {
          // Fallback: manually remove the deleted record from current list
          //console.log('📝 Fallback: manually removing deleted record from local state');
          setMarksList((prevMarks) =>
            prevMarks.filter((mark) => mark.id !== recordToDelete.id)
          );

          // Also refresh from server to ensure data consistency
          //console.log('📝 Refreshing marks from server for consistency');
          await fetchAllMarks();
        }

        // Clear any editing state if we were editing this record
        if (editingRowId === recordToDelete.id) {
          setEditingRowId(null);
          setEditingMarks("");
        }
      } else {
        //console.log('❌ Delete response indicates failure');
        throw new Error(
          "Delete operation failed - no confirmation in response"
        );
      }
    } catch (error: any) {
      console.error("❌ Delete failed:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to delete marks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
      setRecordToDelete(null);
    }
  };

  // Function to clear stored NICs (useful for debugging or forcing refresh)
  // UNUSED FUNCTION - commented out as it's not called anywhere
  // const clearStoredNICs = () => {
  //   localStorage.removeItem('student_nics');
  //   localStorage.removeItem('student_nics_timestamp');
  //   //console.log('🗑️ Cleared stored NICs from localStorage');
  // };

  // Local search function using stored NICs
  const filterStoredNICs = (query: string) => {
    // console.log('🔍 === STARTING FILTER ===');
    // console.log('🔍 Query:', query);
    // console.log('🔍 Query length:', query.trim().length);

    if (query.trim().length < 1) {
      //console.log('🔍 Query too short, clearing suggestions');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // console.log('🔍 Filtering stored NICs with query:', query);
    // console.log('🔍 Total stored NICs:', allStudentNICs.length);
    // console.log('🔍 All stored NICs:', allStudentNICs);

    // Filter stored NICs based on input
    const filtered = allStudentNICs.filter((nic) =>
      nic.toLowerCase().includes(query.toLowerCase())
    );

    // console.log('🔍 Filtered results:', filtered);
    // console.log('🔍 Setting suggestions to:', filtered);
    setSuggestions(filtered);
    //console.log('🔍 Setting showSuggestions to:', filtered.length > 0);
    setShowSuggestions(filtered.length > 0);
    setActiveSuggestion(0);
    //console.log('🔍 === FILTER COMPLETE ===');
  };

  // Autocomplete handlers
  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove non-digit characters and limit to 12 digits for NIC
    const processedValue = value.replace(/\D/g, "").slice(0, 12);
    // console.log('📝 === INPUT CHANGE ===');
    // console.log('📝 New value:', processedValue);
    setStudentId(processedValue);

    // Instantly filter stored NICs (no debouncing needed for local filtering)
    //console.log('📝 Calling filterStoredNICs with:', processedValue);
    filterStoredNICs(processedValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setStudentId(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle autocomplete navigation when suggestions are visible
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
        return;
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (suggestions[activeSuggestion]) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        return;
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        return;
      }
    }

    // Handle Enter and Right Arrow keys when no autocomplete is active
    if (e.key === "Enter" || e.key === "ArrowRight") {
      e.preventDefault();

      // If Student ID is filled but marks is empty, focus on marks input
      if (studentId.trim() && marks === "") {
        marksInputRef.current?.focus();
        return;
      }

      // If both fields are filled and Enter key is pressed, submit the form
      if (
        e.key === "Enter" &&
        !isSubmitting &&
        studentId.trim() &&
        marks !== ""
      ) {
        if (editingRecord) {
          handleUpdateMarks();
        } else {
          handleSubmitMarks();
        }
      }
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Filter marks for current subject only
  const currentSubjectId = getSubjectCode();
  const filteredMarksList = marksList.filter(
    (record) => record.subject_id === currentSubjectId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Header */}
      <header className="bg-black shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/marker")}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 bg-white text-black hover:bg-gray-300 hover:text-black select-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getSubjectColor()} text-white`}
                >
                  {getSubjectIcon()}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white capitalize select-none">
                    {subject} Marks Entry
                  </h1>
                </div>
              </div>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <UserCircle className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white select-none">
                  {localStorage.getItem("user_email") || "marker@example.com"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden py-4 space-y-3">
            {/* Top Row: Back button and User Email */}
            <div className="flex items-center justify-between">
              <Button
                onClick={() => navigate("/marker")}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 bg-white text-black hover:bg-gray-300 hover:text-black select-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Button>

              {/* User Email Display for Mobile */}
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                <UserCircle className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white select-none">
                  {userEmail || "marker@example.com"}
                </span>
              </div>
            </div>

            {/* Bottom Row: Subject Title */}
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getSubjectColor()} text-white`}>
                {getSubjectIcon()}
              </div>
              <div>
                <h1 className="text-base font-bold text-white !text-white capitalize select-none">
                  {subject} Marks Entry
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Add Marks Section */}
        <Card className="mb-4 sm:mb-6 bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-black select-none">
                  <Award className="w-5 h-5 text-black" />
                  <span>Add Student Marks</span>
                </CardTitle>
                <CardDescription className="text-gray-600 select-none">
                  Enter the student NIC and marks for {subject}.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="studentId"
                  className="text-sm font-medium text-gray-800 select-none"
                >
                  Student ID (NIC)
                  {isLoadingNICs && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Loading NICs...)
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    id="studentId"
                    placeholder={
                      isLoadingNICs
                        ? "Loading NICs..."
                        : "Type NIC (numbers only, max 12 digits)..."
                    }
                    value={studentId}
                    onChange={handleStudentIdChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleInputBlur}
                    onFocus={() => {
                      if (studentId.trim() && suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    className="pl-10 bg-white text-black placeholder:text-gray-500"
                    autoComplete="off"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={12}
                  />

                  {/* Dynamic Autocomplete Suggestions */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion}
                          className={`px-4 py-2 cursor-pointer select-none ${
                            index === activeSuggestion
                              ? "bg-blue-50 text-blue-900"
                              : "hover:bg-gray-50 text-gray-800"
                          }`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(suggestion);
                          }}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="text-sm font-medium">
                              {suggestion}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No results message */}
                  {showSuggestions &&
                    suggestions.length === 0 &&
                    !isLoadingNICs &&
                    studentId.trim().length > 0 &&
                    allStudentNICs.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                        <div className="px-4 py-2 text-sm text-gray-500 select-none">
                          No matching NICs found
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="marks"
                  className="text-sm font-medium text-gray-800 select-none"
                >
                  Marks (0-100)
                </Label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    ref={marksInputRef}
                    id="marks"
                    type="number"
                    placeholder="Enter marks (0-100)"
                    value={marks}
                    onChange={(e) =>
                      setMarks(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        // Only submit if form is valid and not already submitting
                        if (!isSubmitting && studentId.trim() && marks !== "") {
                          if (editingRecord) {
                            handleUpdateMarks();
                          } else {
                            handleSubmitMarks();
                          }
                        }
                      }
                    }}
                    className="pl-10 bg-white text-black placeholder:text-gray-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 space-x-3">
              {editingRecord && (
                <Button
                  onClick={cancelEdit}
                  variant="outline"
                  disabled={isSubmitting}
                  className="select-none"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={editingRecord ? handleUpdateMarks : handleSubmitMarks}
                disabled={isSubmitting || !studentId.trim() || marks === ""}
                className={`${getSubjectColor()} hover:opacity-90 text-white px-8 select-none`}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>
                      {editingRecord ? "Updating..." : "Submitting..."}
                    </span>
                  </div>
                ) : editingRecord ? (
                  "Update Marks"
                ) : (
                  "Submit Marks"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Marks Table */}
        <Card className="mb-4 sm:mb-6 bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-black select-none">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-black" />
                <span>All Marks ({filteredMarksList.length})</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-100 text-black border-gray-300 select-none"
              >
                Total Students: {filteredMarksList.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-600 select-none">
              All marks for this subject. Table refreshes automatically after
              adding or updating marks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                  <span className="text-gray-600">
                    Loading existing marks...
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-black font-semibold select-none">
                          Student ID (NIC)
                        </TableHead>
                        <TableHead className="text-black font-semibold select-none">
                          Marks
                        </TableHead>
                        <TableHead className="text-black font-semibold select-none">
                          Percentage
                        </TableHead>
                        <TableHead className="text-black font-semibold select-none">
                          Added At
                        </TableHead>
                        <TableHead className="text-right text-black font-semibold select-none">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMarksList.length > 0 ? (
                        filteredMarksList.map((record, index) => {
                          // Debug each record being rendered
                          //console.log(`🔍 Rendering record ${index}:`, {
                          //   student_id: record.student_id,
                          //   subject_id: record.subject_id,
                          //   marks: record.marks,
                          //   currentSubject: subject,
                          //   expectedSubjectId: getSubjectCode()
                          // });

                          const isEditing = editingRowId === record.id;

                          return (
                            <TableRow
                              key={`${record.student_id}-${record.id || index}`}
                            >
                              <TableCell className="font-medium text-black select-none">
                                {record.student_id || "N/A"}
                              </TableCell>
                              <TableCell className="text-black">
                                {isEditing ? (
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      ref={editInputRef}
                                      type="number"
                                      value={editingMarks}
                                      autoFocus
                                      className="bg-white text-black border-gray-300 focus:border-black focus:ring-gray-300 w-20 h-8"
                                      onChange={(e) =>
                                        setEditingMarks(
                                          e.target.value === ""
                                            ? ""
                                            : Number(e.target.value)
                                        )
                                      }
                                      onFocus={(e) => {
                                        // Auto-select all text immediately when focused
                                        e.target.select();
                                        //console.log('🎯 Text auto-selected:', e.target.value);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          handleInlineSave(record);
                                        } else if (e.key === "Escape") {
                                          handleInlineCancel();
                                        }
                                      }}
                                      min="0"
                                      max="100"
                                      placeholder="0-100"
                                    />
                                    <span className="text-sm text-gray-600 select-none">
                                      /100
                                    </span>
                                  </div>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-black border-gray-300 select-none"
                                  >
                                    {record.marks || 0}/100
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {isEditing ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                                      <div
                                        className={`h-full rounded-full ${
                                          ((Number(editingMarks) || 0) / 100) *
                                            100 >=
                                          75
                                            ? "bg-green-500"
                                            : ((Number(editingMarks) || 0) /
                                                100) *
                                                100 >=
                                              50
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{
                                          width: `${Math.min(
                                            ((Number(editingMarks) || 0) /
                                              100) *
                                              100,
                                            100
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground select-none">
                                      {Math.round(
                                        ((Number(editingMarks) || 0) / 100) *
                                          100
                                      )}
                                      %
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-12 h-2 bg-gray-200 rounded-full">
                                      <div
                                        className={`h-full rounded-full ${
                                          ((record.marks || 0) / 100) * 100 >=
                                          75
                                            ? "bg-green-500"
                                            : ((record.marks || 0) / 100) *
                                                100 >=
                                              50
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                        }`}
                                        style={{
                                          width: `${Math.min(
                                            ((record.marks || 0) / 100) * 100,
                                            100
                                          )}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-black select-none">
                                      {Math.round(
                                        ((record.marks || 0) / 100) * 100
                                      )}
                                      %
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-black select-none">
                                {record.created_at
                                  ? new Date(record.created_at).toLocaleString()
                                  : "Just now"}
                              </TableCell>
                              <TableCell className="text-right">
                                {isEditing ? (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      onClick={() => handleInlineSave(record)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 select-none"
                                      disabled={isUpdating}
                                    >
                                      {isUpdating ? (
                                        <div className="w-4 h-4 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                                      ) : (
                                        <Check className="w-4 h-4" />
                                      )}
                                    </Button>
                                    <Button
                                      onClick={handleInlineCancel}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 select-none"
                                      disabled={isUpdating}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      onClick={() => handleInlineEdit(record)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-black hover:text-gray-700 hover:bg-gray-100 select-none"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteClick(record)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 select-none"
                                      disabled={isDeleting === record.id}
                                    >
                                      {isDeleting === record.id ? (
                                        <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center py-8 text-black select-none"
                          >
                            No marks found. Submit marks above to see them in
                            this table.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {filteredMarksList.length > 0 ? (
                    filteredMarksList.map((record, index) => {
                      // Debug each record being rendered
                      // console.log(`🔍 Rendering mobile record ${index}:`, {
                      //   student_id: record.student_id,
                      //   subject_id: record.subject_id,
                      //   marks: record.marks,
                      //   currentSubject: subject,
                      //   expectedSubjectId: getSubjectCode()
                      // });

                      const isEditing = editingRowId === record.id;

                      return (
                        <div
                          key={`mobile-${record.student_id}-${
                            record.id || index
                          }`}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Header: Student ID and Actions */}
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                              <div className="p-2 bg-gray-100 rounded-full">
                                <User className="w-4 h-4 text-black" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Student ID
                                </p>
                                <h3 className="font-medium text-black">
                                  {record.student_id || "N/A"}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isEditing ? (
                                <>
                                  <Button
                                    onClick={() => handleInlineSave(record)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 select-none"
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <div className="w-4 h-4 border-2 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <Button
                                    onClick={handleInlineCancel}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 select-none"
                                    disabled={isUpdating}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleInlineEdit(record)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-black hover:text-gray-700 hover:bg-gray-100 select-none"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteClick(record)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 select-none"
                                    disabled={isDeleting === record.id}
                                  >
                                    {isDeleting === record.id ? (
                                      <div className="w-4 h-4 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Marks Section */}
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            {/* Marks Input/Display */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-black" />
                                <span className="text-sm font-medium text-black">
                                  Marks:
                                </span>
                              </div>
                              {isEditing ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    ref={editInputRef}
                                    type="number"
                                    value={editingMarks}
                                    autoFocus
                                    className="bg-white text-black border-gray-300 focus:border-black focus:ring-gray-300 w-20 h-8"
                                    onChange={(e) =>
                                      setEditingMarks(
                                        e.target.value === ""
                                          ? ""
                                          : Number(e.target.value)
                                      )
                                    }
                                    onFocus={(e) => {
                                      // Auto-select all text immediately when focused (mobile)
                                      e.target.select();
                                      //console.log('🎯 Mobile text auto-selected:', e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleInlineSave(record);
                                      } else if (e.key === "Escape") {
                                        handleInlineCancel();
                                      }
                                    }}
                                    min="0"
                                    max="100"
                                    placeholder="0-100"
                                  />
                                  <span className="text-sm text-gray-600">
                                    /100
                                  </span>
                                </div>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-black border-gray-300"
                                >
                                  {record.marks || 0}/100
                                </Badge>
                              )}
                            </div>

                            {/* Percentage Bar */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-black">
                                  Percentage:
                                </span>
                                <span className="text-sm text-black">
                                  {isEditing
                                    ? Number(editingMarks) || 0
                                    : record.marks || 0}
                                  %
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    isEditing
                                      ? (Number(editingMarks) || 0) >= 75
                                        ? "bg-black"
                                        : (Number(editingMarks) || 0) >= 50
                                        ? "bg-gray-600"
                                        : "bg-gray-400"
                                      : (record.marks || 0) >= 75
                                      ? "bg-black"
                                      : (record.marks || 0) >= 50
                                      ? "bg-gray-600"
                                      : "bg-gray-400"
                                  }`}
                                  style={{
                                    width: `${Math.min(
                                      isEditing
                                        ? Number(editingMarks) || 0
                                        : record.marks || 0,
                                      100
                                    )}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-black">
                                Added:
                              </span>
                              <span className="text-sm text-black">
                                {record.created_at
                                  ? new Date(
                                      record.created_at
                                    ).toLocaleDateString()
                                  : "Just now"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-black bg-white border border-gray-200 rounded-lg">
                      No marks found. Submit marks above to see them here.
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-gray-50 border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg text-black flex items-center space-x-2 select-none">
              <BookOpen className="w-5 h-5" />
              <span>Marking Instructions for {subject}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-300">
              <h4 className="font-semibold text-black mb-2 select-none">
                General Guidelines:
              </h4>
              <ul className="text-sm text-gray-700 space-y-1 select-none">
                <li>• Ensure the student ID is entered correctly</li>
                <li>• Marks should be between 0 and 100</li>
                <li>• Double-check all entries before submission</li>
                <li>• Contact administrator if you encounter any issues</li>
              </ul>
            </div>

            {(subject?.toLowerCase() === "c.math" ||
              subject?.toLowerCase() === "combined maths") && (
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <p className="text-sm text-gray-700">
                  <strong>Combined Mathematics (Code: 2):</strong> Ensure
                  problem-solving steps are properly evaluated
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Marks</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete marks for student{" "}
              <strong>{recordToDelete?.student_id}</strong>?
              <br />
              <br />
              <strong>Current marks: {recordToDelete?.marks}/100</strong>
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default SubjectPage;
