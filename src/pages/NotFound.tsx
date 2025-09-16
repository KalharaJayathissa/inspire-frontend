import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Animation */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-3 sm:mb-4 animate-scale-in">
            404
          </h1>
          <div className="w-20 sm:w-24 h-1 bg-gradient-hero mx-auto rounded-full animate-fade-in"></div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 animate-fade-in">
          Oops! Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 animate-fade-in leading-relaxed">
          The page you're looking for seems to have wandered off. Let's get you back on track to your academic success!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-slide-up">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 group text-sm sm:text-base h-10 sm:h-11"
          >
            <Home className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Back to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="group text-sm sm:text-base h-10 sm:h-11"
          >
            <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
