import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  

  console.log('Rendering Login component');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Sign in user
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !data.user) {
      setError(signInError?.message || 'Login failed');
      setLoading(false);
      return;
    }

    //printing the access token to console
    console.log('Access Token:', data.session?.access_token);

    // Get user id from token
    const userId = data.user.id;
    // Fetch role from user_role table
    console.log('Fetching role for user ID:', userId);

//*******USED FOR TESTING PURPOSES *********//
//     const { data: allRoles, error } = await supabase
//   .from('user_role')
//   .select('*'); // select all columns for all rows

// if (error) {
//   console.error('Error fetching all roles:', error);
// } else {
//   console.log('All user_role data:', allRoles);
// }
// console.log("ahhh");

    const { data: roleData, error: roleError } = await supabase
      .from('user_role')
      .select('role')
      .eq('user_id', userId)
      .single();

      console.log('error:', roleError, 'roleData:', roleData);
    if (roleError || !roleData) {
      setError('Could not fetch user role');
      setLoading(false);
      return;
    }
    // Redirect based on role
   
    if (roleData.role === 'admin') {
      navigate('/admin/');
    } else if (roleData.role === 'marker') {
      navigate('/marker');
    } else if (roleData.role === 'invigilator') {
      navigate('/invigilator');
    } else {
      setError('Unauthorized role');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded text-black"
          required
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login