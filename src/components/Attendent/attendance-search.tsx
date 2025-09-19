import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Attendent/input';
import { Button } from '../ui/Attendent/button';
import { StudentCard } from './student-card';
import { Card, CardContent } from '../ui/Attendent/card';
import { Badge } from '../ui/Attendent/badge';
import { Search, UserPlus, Users, Calendar, CheckCircle2, ArrowLeft, School } from 'lucide-react';

interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

interface AttendanceSearchProps {
  students: Student[];
  selectedSchool: string;
  onMarkPresent: (student: Student) => void;
  onMarkAbsent: (student: Student) => void;
  onRegisterClick: () => void;
  onBackToSchools: () => void;
  presentStudents: Student[];
}

export function AttendanceSearch({ 
  students, 
  selectedSchool,
  onMarkPresent, 
  onMarkAbsent,
  onRegisterClick,
  onBackToSchools,
  presentStudents 
}: AttendanceSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  });

  // Filter students by selected school
  const schoolPresentStudents = presentStudents.filter(student => student.school === selectedSchool);

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Filter students by selected school first, then by search query
      const schoolStudents = students.filter(student => student.school === selectedSchool);
      const filtered = schoolStudents.filter(student =>
        student.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedStudent(null);
    }
  }, [searchQuery, students, selectedSchool]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery(student.nic);
    setShowSuggestions(false);
  };

  const handlePresentStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery(student.nic);
    setShowSuggestions(false);
    // Scroll to student card
    setTimeout(() => {
      const studentCard = document.getElementById('student-card');
      if (studentCard) {
        studentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleMarkPresent = (student: Student) => {
    onMarkPresent(student);
    
    // Clear search and hide student card
    setSearchQuery('');
    setSelectedStudent(null);
    setShowSuggestions(false);
  };

  const handleMarkAbsent = (student: Student) => {
    onMarkAbsent(student);
    
    // Clear search and hide student card
    setSearchQuery('');
    setSelectedStudent(null);
    setShowSuggestions(false);
  };

  const isStudentAlreadyPresent = selectedStudent ? 
    schoolPresentStudents.some(s => s.id === selectedStudent.id) : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBackToSchools}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Button>
            <div className="flex items-center gap-2">
              <School className="w-5 h-5" />
              <h1>{selectedSchool}</h1>
            </div>
          </div>
          
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by NIC or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((student) => (
                      <div
                        key={student.id}
                        className="px-4 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleStudentSelect(student)}
                      >
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          NIC: {student.nic}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={onRegisterClick}
                variant="outline"
                className="shrink-0"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Register Student</span>
                <span className="sm:hidden">Register</span>
              </Button>
            </div>

            {showSuggestions && suggestions.length === 0 && searchQuery.length > 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No students found. Click "Register Student" to add a new student.
              </div>
            )}
          </div>

          {/* Student Card */}
          {selectedStudent && (
            <div id="student-card">
              <StudentCard
                student={selectedStudent}
                onMarkPresent={handleMarkPresent}
                onMarkAbsent={handleMarkAbsent}
                isAlreadyPresent={isStudentAlreadyPresent}
              />
            </div>
          )}

          {/* Present Students List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Present Students Today
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{currentDate}</span>
                </div>
              </div>
              <Badge variant="secondary">
                {schoolPresentStudents.length} Present
              </Badge>
            </div>

            {schoolPresentStudents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="mb-2">No Students Present</h3>
                  <p className="text-muted-foreground text-center">
                    No students from {selectedSchool} have been marked as present today. 
                    Use the search function to mark attendance.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3">
                {schoolPresentStudents.map((student, index) => (
                  <Card 
                    key={student.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handlePresentStudentClick(student)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-medium">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="flex items-center gap-2">
                              <span className="truncate">{student.name}</span>
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              NIC: {student.nic}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-200 shrink-0">
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