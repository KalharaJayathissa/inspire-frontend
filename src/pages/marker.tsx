import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, BookOpen, Atom, Calculator, Info, User, Zap, Rocket } from 'lucide-react';
import { checkTokenExpiration, setupTokenMonitoring } from '../services/api';
import logo from '@/assets/kess-logo-removebg-preview.png';

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndLoadUser = async () => {
      //console.log('🔍 Marker Dashboard: Checking authentication...');
      
      // Development mode: Skip authentication for testing
      if (import.meta.env.MODE === 'development') {
        //console.log('🚧 Development mode: Skipping token validation');
        // Get real user email from localStorage or use default
        const email = localStorage.getItem('user_email') || 'marker@kess.com';
        setUserEmail(email);
        //console.log('✅ Development mode: User email set to', email);
        return;
      }

      // Simple token presence check - don't validate expiration on page load
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('user_email');
      
      // console.log('🔑 Checking stored credentials:');
      // console.log('  - Token exists:', !!token);
      // console.log('  - Email exists:', !!email);
      // console.log('  - Email value:', email);
      
      if (!token || !email) {
        //console.log('❌ Missing credentials, redirecting to home page');
        navigate('/');
        return;
      }

      // Token exists, load user info (validation will happen when making API calls)
      //console.log('✅ Credentials found, setting user email');
      setUserEmail(email);
    };

    checkAuthAndLoadUser();

    // Clear any existing selection/focus when component mounts
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
    if (document.activeElement && document.activeElement !== document.body) {
      (document.activeElement as HTMLElement).blur();
    }

    // Setup token monitoring only in production mode
    if (import.meta.env.MODE !== 'development') {
      //console.log('🔄 Setting up token monitoring (checks every 2 minutes)');
      const stopMonitoring = setupTokenMonitoring(2); // Check every 2 minutes
      
      // Cleanup monitoring when component unmounts
      return () => {
        //console.log('🛑 Stopping token monitoring');
        stopMonitoring();
      };
    } else {
      //console.log('🚧 Development mode: Skipping token monitoring setup');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    navigate('/login');
  };

  const handleSubjectClick = (subject: string) => {
    navigate(`/subject/${subject.toLowerCase()}`);
  };

  const subjects = [
    {
      name: 'Physics',
      icon: <Rocket className="w-8 h-8" />,
      description: 'Manage physics marks ',
      color: 'bg-black',
      hoverColor: 'hover:bg-gray-800'
    },
    {
      name: 'Chemistry',
      icon: <Atom className="w-8 h-8" />,
      description: 'Manage chemistry marks',
      color: 'bg-gray-800',
      hoverColor: 'hover:bg-gray-700'
    },
    {
      name: 'Combined Maths',
      icon: <Calculator className="w-8 h-8" />,
      description: 'Manage combined mathematics marks',
      color: 'bg-gray-700',
      hoverColor: 'hover:bg-gray-600'
    }
  ];

  return (
    <>
      <style>{`
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          cursor: default !important;
        }
        button, .cursor-pointer {
          cursor: pointer !important;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 select-none" style={{userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none'}}>
        {/* Header */}
      <header className="bg-black shadow-md border-b border-gray-800 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none">
          <div className="flex justify-between items-center h-16 sm:h-20 select-none">
            {/* Logo and Project Name */}
            <div className="flex items-center space-x-2 sm:space-x-3 select-none">
              <img 
                src={logo} 
                alt="KESS Inspire Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg object-contain select-none pointer-events-none"
              />
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white select-none">KESS Inspire Student marks Portal</h1>
                <p className="text-xs sm:text-sm text-gray-300 select-none">Paper Assessment System</p>
              </div>
              {/* Mobile title - shorter version */}
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold text-white select-none">KESS Portal</h1>
                <p className="text-xs text-gray-300 select-none">Assessment</p>
              </div>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                <div className="p-1 bg-white rounded-full">
                  <User className="w-4 h-4 text-black" />
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white select-none">Welcome back</p>
                  <p className="text-sm text-gray-300 select-none">{userEmail}</p>
                </div>
                {/* Mobile user info - just email */}
                <div className="text-right block sm:hidden">
                  <p className="text-xs text-gray-300 truncate max-w-24 select-none">{userEmail.split('@')[0]}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 border-white text-white hover:bg-white hover:text-black select-none"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 select-none">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8 select-none">
          <h2 className="text-xl sm:text-2xl font-bold text-black mb-2 select-none">Dashboard</h2>
          <p className="text-sm sm:text-base text-gray-700 select-none">Select a subject to manage student marks and assessments</p>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 select-none">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className="cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl bg-white border-gray-200 hover:shadow-2xl select-none"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <CardHeader className="pb-4 select-none">
                <div className="flex items-center justify-between select-none">
                  <div className={`p-3 rounded-lg ${subject.color} text-white shadow-md select-none`}>
                    {subject.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-300 select-none">
                    Active
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-black select-none">{subject.name}</CardTitle>
                <CardDescription className="text-sm text-gray-700 select-none">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="select-none">
                <Button
                  className={`w-full ${subject.color} ${subject.hoverColor} text-white transition-colors select-none`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectClick(subject.name);
                  }}
                >
                  Manage Marks
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions Section */}
        <Card className="bg-gray-50 border-gray-300 select-none">
          <CardHeader className="pb-3 sm:pb-4 select-none">
            <div className="flex items-center space-x-2 select-none">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-black select-none" />
              <CardTitle className="text-base sm:text-lg text-black select-none">Marking Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 select-none">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-300 select-none">
              <h4 className="font-semibold text-black mb-2 text-sm sm:text-base select-none">General Guidelines:</h4>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 select-none">
                <li>• Ensure all marks are entered accurately and double-checked before submission</li>
                <li>• All assessments must be completed within the designated time frame</li>
                <li>• Contact the administrator if you encounter any technical issues</li>
              </ul>
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
    </>
  );
};

export default Dashboard;