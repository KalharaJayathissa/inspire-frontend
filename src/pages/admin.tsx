import React, { useState } from 'react';
import { getstudents } from '../lib/api';

function AdminPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetStudents = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching students...');
      const data = await getstudents();
      console.log('Students data received:', data);
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4 text-black">Admin Dashboard</h1>
      <p className="text-black mb-6">Welcome, Admin! You have full access.</p>
      
      <button
        onClick={handleGetStudents}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-6"
      >
        {loading ? 'Loading...' : 'Get Students'}
      </button>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-100 rounded">
          {error}
        </div>
      )}

      {/* Debug info */}
      <div className="text-black mb-4 p-3 bg-yellow-100 rounded">
        <p>Debug Info:</p>
        <p>Students array length: {students.length}</p>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error || 'None'}</p>
      </div>

      {students.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-4 text-black">Students List ({students.length} students)</h2>
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-black">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.id || index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {student.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
