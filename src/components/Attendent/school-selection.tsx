import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';
import { School, Users, ChevronRight } from 'lucide-react';

interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

interface SchoolSelectionProps {
  students: Student[];
  onSelectSchool: (school: string) => void;
}

export function SchoolSelection({ students, onSelectSchool }: SchoolSelectionProps) {
  // Get unique schools from students
  const schools = Array.from(new Set(students.map(student => student.school)))
    .filter(school => school !== 'Not Specified')
    .sort();

  // Get student count per school
  const getStudentCount = (school: string) => {
    return students.filter(student => student.school === school).length;
  };

  const getPresentCount = (school: string) => {
    return students.filter(student => student.school === school && student.isPresent).length;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="flex items-center justify-center gap-2">
              <School className="w-8 h-8" />
              Select School
            </h1>
            <p className="text-muted-foreground">
              Choose a school to mark attendance for students
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {schools.map((school) => {
              const studentCount = getStudentCount(school);
              const presentCount = getPresentCount(school);
              
              return (
                <Card 
                  key={school} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onSelectSchool(school)}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <School className="w-5 h-5" />
                        <span className="truncate">{school}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{studentCount} Students</span>
                      </div>
                      {presentCount > 0 && (
                        <div className="text-green-700 font-medium">
                          {presentCount} Present Today
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {schools.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <School className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="mb-2">No Schools Found</h3>
                <p className="text-muted-foreground text-center">
                  No schools are available. Register students to create school entries.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}