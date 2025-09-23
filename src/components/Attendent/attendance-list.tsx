import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from ''
// import { Button } from './ui/button';
// /import { Badge } from './ui/badge';
import { ArrowLeft, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Attendent/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';



interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

interface AttendanceListProps {
  presentStudents: Student[];
  onBack: () => void;
}

export function AttendanceList({ presentStudents, onBack }: AttendanceListProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Present Students
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {presentStudents.length} Present
        </Badge>
      </div>

      {presentStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="mb-2">No Students Present</h3>
            <p className="text-muted-foreground text-center">
              No students have been marked as present today. 
              Use the search function to mark attendance.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {presentStudents.map((student, index) => (
            <Card key={student.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2">
                        {student.name}
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        NIC: {student.nic}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{student.school}</p>
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      Present
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}