import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchSchools, getTodaysAttendance, fetchStudentsBySchool } from '@/lib/api';

export function ApiTest() {
  const [schoolId, setSchoolId] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testFetchSchools = async () => {
    setLoading(true);
    try {
      const schools = await fetchSchools();
      console.log('Schools result:', schools);
      setResults({ type: 'schools', data: schools });
    } catch (error) {
      console.error('Error fetching schools:', error);
      setResults({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  const testGetTodaysAttendance = async () => {
    if (!schoolId) {
      alert('Please enter a school ID');
      return;
    }
    
    setLoading(true);
    try {
      const attendance = await getTodaysAttendance(parseInt(schoolId));
      console.log('Attendance result:', attendance);
      setResults({ type: 'attendance', data: attendance });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setResults({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  const testFetchStudents = async () => {
    if (!schoolId) {
      alert('Please enter a school ID');
      return;
    }
    
    setLoading(true);
    try {
      const students = await fetchStudentsBySchool(parseInt(schoolId));
      console.log('Students result:', students);
      setResults({ type: 'students', data: students });
    } catch (error) {
      console.error('Error fetching students:', error);
      setResults({ type: 'error', data: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Enter School ID"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            className="w-48"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={testFetchSchools} disabled={loading}>
            Test Fetch Schools
          </Button>
          <Button onClick={testFetchStudents} disabled={loading}>
            Test Fetch Students
          </Button>
          <Button onClick={testGetTodaysAttendance} disabled={loading}>
            Test Today's Attendance
          </Button>
        </div>
      </div>

      {loading && <div>Loading...</div>}

      {results && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Results ({results.type}):</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}