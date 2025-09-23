import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Attendent/input';
import { Button } from '../ui/Attendent/button';
import { StudentCard } from './student-card';
import { Card, CardContent } from '../ui/Attendent/card';
import { Badge } from '../ui/Attendent/badge';
import { Search, UserPlus, Users, Calendar, CheckCircle2, ArrowLeft, School, Loader2 } from 'lucide-react';
import { fetchStudentsBySchool, markAttendance } from '@/lib/api';
import { toast } from 'sonner';

interface StudentBasic {
  id: number;
  name: string;
  nic: string;
  school_id: number;
  contact_email: string;
  contact_phone: string;
  registered_at: string;
}

interface PresentStudent {
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

interface AttendanceSearchProps {
  selectedSchoolId: number;
  selectedSchoolName: string;
  onRegisterClick: () => void;
  onBackToSchools: () => void;
  presentStudents: PresentStudent[];
  refreshAttendance: () => void;
  loading: boolean;
}

export function AttendanceSearch({ 
  selectedSchoolId,
  selectedSchoolName,
  onRegisterClick,
  onBackToSchools,
  presentStudents,
  refreshAttendance,
  loading
}: AttendanceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [nicSuggestions, setNicSuggestions] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentBasic | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [schoolStudents, setSchoolStudents] = useState<StudentBasic[]>([]);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  // Debug: Log present students data whenever it changes
  useEffect(() => {
    console.log('AttendanceSearch - presentStudents prop changed:', presentStudents);
    console.log('AttendanceSearch - presentStudents length:', presentStudents.length);
  }, [presentStudents]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });

  // Load students for the selected school when component mounts
  useEffect(() => {
    if (selectedSchoolId) {
      loadSchoolStudents();
    }
  }, [selectedSchoolId]);

  const loadSchoolStudents = async () => {
    try {
      setLoadingStudents(true);
      const studentsData = await fetchStudentsBySchool(selectedSchoolId);
      setSchoolStudents(studentsData);
    } catch (error: any) {
      toast.error('Failed to load students');
      console.error('Failed to load students:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Handle NIC search - show NIC suggestions
  useEffect(() => {
    if (searchQuery.length > 0 && schoolStudents.length > 0) {
      const filtered = schoolStudents
        .filter(student => 
          student.nic.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(student => student.nic)
        .slice(0, 5); // Show max 5 NIC suggestions
      
      setNicSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setNicSuggestions([]);
      setShowSuggestions(false);
      setSelectedStudent(null);
    }
  }, [searchQuery, schoolStudents]);

  const handleNicSelect = async (nic: string) => {
    try {
      setLoadingStudent(true);
      setSearchQuery(nic);
      setShowSuggestions(false);
      
      // Find the full student details
      const student = schoolStudents.find(s => s.nic === nic);
      if (student) {
        setSelectedStudent(student);
      }
    } catch (error: any) {
      toast.error('Failed to load student details');
      console.error('Failed to load student details:', error);
    } finally {
      setLoadingStudent(false);
    }
  };

  const handlePresentStudentClick = (student: PresentStudent) => {
    // Convert PresentStudent to StudentBasic for display
    const basicStudent: StudentBasic = {
      id: student.student_id,
      name: student.student_name,
      nic: student.student_nic,
      school_id: selectedSchoolId,
      contact_email: student.contact_email,
      contact_phone: student.contact_phone,
      registered_at: student.registered_at
    };
    
    setSelectedStudent(basicStudent);
    setSearchQuery(student.student_nic);
    setShowSuggestions(false);
    
    // Scroll to student card
    setTimeout(() => {
      const studentCard = document.getElementById('student-card');
      if (studentCard) {
        studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleMarkPresent = async (student: StudentBasic) => {
    try {
      // Find the student_school_id from the attendance data or use the student id
      const existingAttendance = presentStudents.find(p => p.student_nic === student.nic);
      const studentSchoolId = existingAttendance?.student_school_id || student.id;
      const school_id = student.school_id;

      await markAttendance(studentSchoolId, 1, student.nic, school_id); // 1 = Present, include NIC
      toast.success(`🎉 ${student.name} marked as present!`);
      
      // Clear search and refresh attendance
      setSearchQuery('');
      setSelectedStudent(null);
      setShowSuggestions(false);
      refreshAttendance();
    } catch (error: any) {
      toast.error('Failed to mark attendance');
      console.error('Failed to mark attendance:', error);
    }
  };

  const handleMarkAbsent = async (student: StudentBasic) => {
    try {
      // Find the student_school_id from the attendance data
      const existingAttendance = presentStudents.find(p => p.student_nic === student.nic);
      const school_id = student.school_id;
      if (existingAttendance) {
        await markAttendance(existingAttendance.student_school_id, 0, student.nic, school_id); // 0 = Absent, include NIC
        toast.info(`${student.name} marked as absent.`);
        
        // Clear search and refresh attendance
        setSearchQuery('');
        setSelectedStudent(null);
        setShowSuggestions(false);
        refreshAttendance();
      } else {
        toast.error('Cannot mark absent - student has no attendance record');
      }
    } catch (error: any) {
      toast.error('Failed to mark attendance');
      console.error('Failed to mark attendance:', error);
    }
  };

  const isStudentAlreadyPresent = selectedStudent ? 
    presentStudents.some(s => s.student_nic === selectedStudent.nic) : false;
  if (loadingStudents) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl mb-2">Loading Students...</h3>
            <p className="text-muted-foreground text-sm sm:text-base text-center px-4">
              Please wait while we fetch the student data.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-4xl">
        <div className="space-y-4 sm:space-y-6">
          {/* Header with Back Button */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
            <Button 
              variant="outline" 
              onClick={onBackToSchools}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <School className="w-4 h-4 sm:w-5 sm:h-5" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold truncate">
                {selectedSchoolName}
              </h1>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3">
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by NIC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 sm:h-10"
                    disabled={loadingStudent}
                  />
                  {loadingStudent && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin" />
                  )}
                </div>
                  {showSuggestions && nicSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {nicSuggestions.map((nic) => (
                      <div
                        key={nic}
                        className="px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 touch-manipulation"
                        onClick={() => handleNicSelect(nic)}
                      >
                        <div className="font-medium text-sm sm:text-base">NIC: {nic}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Click to view student details
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={onRegisterClick}
                variant="outline"
                className="w-full sm:w-auto sm:shrink-0 h-11 sm:h-10"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Register Student</span>
                <span className="sm:hidden">Register</span>
              </Button>
            </div>

            {showSuggestions && nicSuggestions.length === 0 && searchQuery.length > 0 && !loadingStudent && (
              <div className="text-center py-4 text-muted-foreground text-sm sm:text-base px-4">
                No students found with this NIC. Click "Register Student" to add a new student.
              </div>
            )}
          </div>          {/* Student Card */}
          {selectedStudent && (
            <div id="student-card">
              <Card className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">{selectedStudent.name}</h3>
                  <div className="grid gap-2 text-xs sm:text-sm">
                    <div className="break-words"><strong>NIC:</strong> {selectedStudent.nic}</div>
                    <div className="break-words"><strong>Email:</strong> {selectedStudent.contact_email}</div>
                    <div className="break-words"><strong>Phone:</strong> {selectedStudent.contact_phone}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {!isStudentAlreadyPresent ? (
                      <Button 
                        onClick={() => handleMarkPresent(selectedStudent)}
                        className="bg-green-600 hover:bg-green-700 w-full sm:w-auto h-11 sm:h-10"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Present
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleMarkAbsent(selectedStudent)}
                        variant="destructive"
                        className="w-full sm:w-auto h-11 sm:h-10"
                      >
                        Mark Absent
                      </Button>
                    )}
                  </div>
                  {isStudentAlreadyPresent && (
                    <Badge variant="outline" className="text-green-700 border-green-200 w-fit">
                      Already Present
                    </Badge>
                  )}
                </div>
              </Card>
            </div>
          )}          {/* Present Students List */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Present Students Today
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{currentDate}</span>
                </div>
              </div>
              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                {presentStudents.length} Present
              </Badge>
            </div>

            {presentStudents.length === 0 && !loading ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg mb-2">No Students Present</h3>
                  <p className="text-muted-foreground text-center text-sm sm:text-base px-2">
                    No students from {selectedSchoolName} have been marked as present today. 
                    Use the search function to mark attendance.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-2 sm:gap-3">
                {presentStudents.map((student, index) => (
                  <Card 
                    key={student.student_school_id} 
                    className="cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] touch-manipulation"
                    onClick={() => handlePresentStudentClick(student)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 text-green-800 font-medium text-xs sm:text-sm">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="flex items-center gap-2 text-sm sm:text-base">
                              <span className="truncate font-medium">{student.student_name}</span>
                              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              NIC: {student.student_nic}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-200 shrink-0 text-xs">
                          Present
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}