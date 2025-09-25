import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTokenInfo } from '../services/api';

const DebugPage = () => {
  const [authData, setAuthData] = useState<any>({});
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = () => {
    const data = {
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'), 
      user_email: localStorage.getItem('user_email'),
      user_id: localStorage.getItem('user_id'),
      environment: import.meta.env.MODE,
    };
    
    setAuthData(data);

    // Analyze token if it exists
    if (data.access_token) {
      try {
        const info = getTokenInfo(data.access_token);
        setTokenInfo(info);
      } catch (error) {
        setTokenInfo({ error: 'Failed to parse token' });
      }
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    loadAuthData();
  };

  const testToken = () => {
    if (authData.access_token) {
      const info = getTokenInfo(authData.access_token);
      console.log('Token Analysis:', info);
      alert(`Token valid: ${info.valid}, Expired: ${info.expired}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Debug Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Environment Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
            <p><strong>Base URL:</strong> {import.meta.env.BASE_URL}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>Access Token:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 break-all text-sm">
                {authData.access_token || 'None'}
              </div>
            </div>
            <div>
              <strong>Refresh Token:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 break-all text-sm">
                {authData.refresh_token || 'None'}
              </div>
            </div>
            <div>
              <strong>User Email:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 text-sm">
                {authData.user_email || 'None'}
              </div>
            </div>
            <div>
              <strong>User ID:</strong>
              <div className="bg-gray-100 p-2 rounded mt-1 text-sm">
                {authData.user_id || 'None'}
              </div>
            </div>
          </CardContent>
        </Card>

        {tokenInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Token Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Valid:</strong> {tokenInfo.valid ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Expired:</strong> {tokenInfo.expired ? '❌ Yes' : '✅ No'}</p>
                {tokenInfo.expiresAt && (
                  <p><strong>Expires At:</strong> {new Date(tokenInfo.expiresAt).toLocaleString()}</p>
                )}
                {tokenInfo.timeRemainingFormatted && (
                  <p><strong>Time Remaining:</strong> {tokenInfo.timeRemainingFormatted}</p>
                )}
                {tokenInfo.payload && (
                  <div>
                    <strong>Token Payload:</strong>
                    <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
                      {JSON.stringify(tokenInfo.payload, null, 2)}
                    </pre>
                  </div>
                )}
                {tokenInfo.error && (
                  <p className="text-red-600"><strong>Error:</strong> {tokenInfo.error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={loadAuthData}>Refresh Data</Button>
          <Button onClick={testToken} disabled={!authData.access_token}>Test Token</Button>
          <Button onClick={clearAuth} variant="destructive">Clear Auth Data</Button>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;