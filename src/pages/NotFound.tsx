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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4 animate-scale-in">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-hero mx-auto rounded-full animate-fade-in"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
          Oops! Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 animate-fade-in">
          The page you're looking for seems to have wandered off. Let's get you back on track to your academic success!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 group"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
