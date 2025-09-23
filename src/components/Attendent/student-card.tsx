import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';
import { Badge } from '../ui/Attendent/badge';
import { User, School, CreditCard, CheckCircle2, UserCheck, UserX } from 'lucide-react';

interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

interface StudentCardProps {
  student: Student;
  onMarkPresent: (student: Student) => void;
  onMarkAbsent: (student: Student) => void;
  isAlreadyPresent: boolean;
}

export function StudentCard({ student, onMarkPresent, onMarkAbsent, isAlreadyPresent }: StudentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Student Information
          {isAlreadyPresent && (
            <Badge variant="default" className="ml-auto bg-green-100 text-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Already Present
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Name:</span>
            </div>
            <p className="ml-6 break-words">{student.name}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">NIC Number:</span>
            </div>
            <p className="ml-6 break-all">{student.nic}</p>
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">School:</span>
            </div>
            <p className="ml-6 break-words">{student.school}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          {isAlreadyPresent ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Student Already Marked Present</p>
                <p className="text-green-700 text-sm">This student's attendance has been recorded for today</p>
              </div>
              <Button 
                onClick={() => onMarkAbsent(student)}
                variant="destructive"
                className="w-full h-12"
                size="lg"
              >
                <UserX className="w-5 h-5 mr-2" />
                Mark as Absent
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div>
                <p className="font-medium">Mark Student as Present</p>
                <p className="text-sm text-muted-foreground">
                  Click the button below to mark attendance
                </p>
              </div>
              <Button 
                onClick={() => onMarkPresent(student)}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                size="lg"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Yes! Mark as Present
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}