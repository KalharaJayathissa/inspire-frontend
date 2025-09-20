import React, { useState } from 'react';
import { SchoolSelection } from '@/components/Attendent/school-selection';
import { AttendanceSearch } from '@/components/Attendent/attendance-search';
import { RegisterStudent } from '@/components/Attendent/register-student';
import { toast, Toaster } from 'sonner';

interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

type Page = 'schools' | 'search' | 'register';

// Mock data for demonstration
const initialStudents: Student[] = [
  {
    id: '1',
    nic: '200158794V',
    name: 'Amara Silva',
    school: 'Royal College',
    contactNumber: '0771234567',
    homeAddress: '123 Main Street, Colombo 07',
    isPresent: false
  },
  {
    id: '2',
    nic: '199987654V',
    name: 'Kavinda Perera',
    school: 'Trinity College',
    contactNumber: '0779876543',
    homeAddress: '456 Lake Road, Kandy',
    isPresent: false
  },
  {
    id: '3',
    nic: '200245698V',
    name: 'Nimali Fernando',
    school: 'Holy Family Convent',
    contactNumber: '0763456789',
    homeAddress: '789 Hill Street, Galle',
    isPresent: false
  },
  {
    id: '4',
    nic: '200334567V',
    name: 'Rashan Mendis',
    school: 'St. Joseph\'s College',
    contactNumber: '0712345678',
    homeAddress: '321 Park Avenue, Negombo',
    isPresent: false
  },
  {
    id: '5',
    nic: '199876543V',
    name: 'Tharushi Jayawardena',
    school: 'Musaeus College',
    contactNumber: '0754567890',
    homeAddress: '654 Beach Road, Mount Lavinia',
    isPresent: false
  }
];

function Invigilator() {
  const [currentPage, setCurrentPage] = useState<Page>('schools');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const presentStudents = students.filter(student => student.isPresent);

  const handleSelectSchool = (school: string) => {
    setSelectedSchool(school);
    setCurrentPage('search');
  };

  const handleMarkPresent = (student: Student) => {
    const updatedStudent = { ...student, isPresent: true };
    setStudents(prev => prev.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    ));
    
    toast.success(`🎉 ${updatedStudent.name} marked as present!`);
  };

  const handleMarkAbsent = (student: Student) => {
    const updatedStudent = { ...student, isPresent: false };
    setStudents(prev => prev.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    ));
    
    toast.info(`${updatedStudent.name} marked as absent.`);
  };

  const handleRegisterStudent = (studentData: Omit<Student, 'id' | 'isPresent'>) => {
    // Check if NIC already exists
    const existingStudent = students.find(s => s.nic === studentData.nic);
    if (existingStudent) {
      toast.error('A student with this NIC already exists!');
      return;
    }

    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
      isPresent: true // Automatically mark new student as present
    };

    setStudents(prev => [...prev, newStudent]);
    toast.success(`🎉 ${newStudent.name} has been registered and marked as present!`);
    setCurrentPage('search');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'schools':
        return (
          <SchoolSelection
            students={students}
            onSelectSchool={handleSelectSchool}
          />
        );
      case 'search':
        return (
          <AttendanceSearch
            students={students}
            selectedSchool={selectedSchool}
            onMarkPresent={handleMarkPresent}
            onMarkAbsent={handleMarkAbsent}
            onRegisterClick={() => setCurrentPage('register')}
            onBackToSchools={() => setCurrentPage('schools')}
            presentStudents={presentStudents}
          />
        );
      case 'register':
        return (
          <RegisterStudent
            selectedSchool={selectedSchool}
            onBack={() => setCurrentPage('search')}
            onRegister={handleRegisterStudent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      {renderPage()}
    </div>
  );
}

export default  Invigilator;