import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';
import { School, Users, ChevronRight, Loader2 } from 'lucide-react';
import { fetchSchools } from '@/lib/api';
import { toast } from 'sonner';

interface School {
  id: number;
  name: string;
  address: string;
  created_at: string;
}

interface SchoolSelectionProps {
  onSelectSchool: (schoolId: number, schoolName: string) => void;
}

export function SchoolSelection({ onSelectSchool }: SchoolSelectionProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const schoolsData = await fetchSchools();
      setSchools(schoolsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load schools');
      toast.error('Failed to load schools. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <h3 className="mb-2">Loading Schools...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the schools.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <School className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="mb-2 text-red-600">Error Loading Schools</h3>
              <p className="text-muted-foreground text-center mb-4">{error}</p>
              <Button onClick={loadSchools}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            {schools.map((school) => (
              <Card 
                key={school.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectSchool(school.id, school.name)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <School className="w-5 h-5" />
                      <span className="truncate">{school.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{school.address}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {schools.length === 0 && !loading && !error && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <School className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="mb-2">No Schools Found</h3>
                <p className="text-muted-foreground text-center">
                  No schools are available at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}