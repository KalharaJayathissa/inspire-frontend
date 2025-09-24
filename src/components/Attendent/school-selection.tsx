import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Attendent/card";
import { Button } from "../ui/Attendent/button";
import { School, Users, ChevronRight, Loader2, User2 } from "lucide-react";
import { fetchSchools } from "@/lib/api";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import { handleApiError } from "@/lib/auth-utils";

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
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    loadSchools();
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        // Extract name from email (everything before @)
        const name = session.user.email.split("@")[0];
        // Capitalize first letter and format nicely
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        setUserName(formattedName);
      }
    } catch (error) {
      console.error("Error loading user name:", error);
    }
  };

  const loadSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      const schoolsData = await fetchSchools();
      setSchools(schoolsData);
    } catch (err: any) {
      // Handle authentication/authorization errors
      const wasAuthError = await handleApiError(
        err,
        navigate,
        "Failed to load schools. Please try again."
      );
      if (!wasAuthError) {
        setError(err.message || "Failed to load schools");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-4xl">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl mb-2">Loading Schools...</h3>
            <p className="text-muted-foreground text-sm sm:text-base text-center px-4">
              Please wait while we fetch the schools.
            </p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-4xl">
          <Card className="mx-2 sm:mx-0">
            <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
              <School className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl mb-2 text-red-600">
                Error Loading Schools
              </h3>
              <p className="text-muted-foreground text-center text-sm sm:text-base mb-4 px-2">
                {error}
              </p>
              <Button
                onClick={loadSchools}
                className="w-full sm:w-auto px-6 py-2"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-4xl">
        {/* User Name Box - Top Right */}
        {userName && (
          <div className="mb-4 sm:mb-6 flex justify-end">
            <div className="bg-white text-black px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg shadow-md border border-gray-200 w-fit">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <User2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-900">
                  Logged in as {userName}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2 px-4 sm:px-0">
            <h1 className="flex items-center justify-center gap-2 text-xl sm:text-2xl lg:text-3xl font-bold">
              <School className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              Select School
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Choose a school to mark attendance for students
            </p>
          </div>

          {/* Schools Grid */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 px-2 sm:px-0">
            {schools.map((school) => (
              <Card
                key={school.id}
                className="cursor-pointer hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
                onClick={() => onSelectSchool(school.id, school.name)}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-start sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                      <School className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 sm:mt-0 shrink-0" />
                      <span className="text-sm sm:text-base font-medium leading-tight break-words">
                        {school.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 sm:mt-0" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-start gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 shrink-0" />
                      <span className="break-words leading-tight">
                        {school.address}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {schools.length === 0 && !loading && !error && (
            <Card className="mx-2 sm:mx-0">
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
                <School className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl mb-2">No Schools Found</h3>
                <p className="text-muted-foreground text-center text-sm sm:text-base px-2">
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
