"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const scrollToForm = () => {
    const element = document.querySelector("#student-form");
    if (element) {
      const navHeight = window.innerWidth >= 768 ? 80 : 64;
      const elementPosition = (element as HTMLElement).offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    } else {
      // If form not found, navigate to register page
      navigate("/register");
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center bg-white overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12"
    >
      {/* Background decoration - Light gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/10 via-transparent to-purple-500/10"></div>

      {/* Geometric decorative elements */}
      <div className="absolute top-20 left-8 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-8 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      {/* Modern floating elements */}
      <div className="absolute top-32 left-16 w-4 h-4 bg-orange-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-48 right-24 w-6 h-6 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-24 w-5 h-5 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          
          {/* Main Title - Reduced font sizes */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight leading-none">
                KESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">INSPIRE 2025</span>
              </h1>
              {/* <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-orange-500">2025</div> */}
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 tracking-widest font-light">
              KEGALLE ENGINEERING STUDENTS' SOCIETY
            </p>
          </div>

          {/* Subtitle - Updated content */}
          <p className="text-lg sm:text-xl lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
            A leading academic competition designed for A/L Physical Stream
            students in Kegalle District. Organized by the Kegalle Engineering
            Students' Society (KESS).
          </p>

          {/* Single Register Now Button */}
          <div className="flex justify-center items-center pt-6">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xl px-12 py-5 rounded-full shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
            >
              Register Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Countdown Section */}
          <div className="pt-8 sm:pt-12">
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Get Ready! Countdown to Exam Series
              </h2>
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
