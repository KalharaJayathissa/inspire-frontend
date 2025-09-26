"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { useNavigate } from "react-router-dom";
import Countdowntimer2 from "./Countdowntimer2";
import BackgroundImg from "@/assets/Background.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const scrollToForm = () => {
    const element = document.querySelector("#student-form");
    if (element) {
      const navHeight = window.innerWidth >= 768 ? 80 : 64;
      const elementPosition = (element as HTMLElement).offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    } else {
      // If form not found, navigate to register page
      navigate("/register");
    }
  };

  return (
    <section
      id="home"
      className="relative flex items-center justify-center bg-white/80 backdrop-blur-sm overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-12"
    >
      {/* Background image with low opacity */}
      <div className="absolute inset-0 -z-10">
        <img
          src={BackgroundImg}
          alt="Background"
          className="w-full h-full object-cover pointer-events-none opacity-40"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      {/* Background decoration - Light gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/10 via-transparent to-purple-500/10"></div> */}
      {/* Background image with low opacity
      <img
        src={require('@/assets/Background.jpg')}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
        style={{mixBlendMode: 'multiply'}}
      /> */}

      {/* Geometric decorative elements */}
      {/* <div className="absolute top-20 left-8 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-8 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
       */}

      {/* Modern floating elements */}
      {/* <div className="absolute top-32 left-16 w-4 h-4 bg-orange-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-48 right-24 w-6 h-6 bg-purple-400/60 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-24 w-5 h-5 bg-blue-400/60 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div> */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Main Title - Reduced font sizes */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight leading-none">
                KESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">INSPIRE</span>
              </h1> */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 tracking-tight leading-none">
                KESS <span className="text-[#2D620A]">INSPIRE</span>
              </h1>
              <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-orange-500">
                2025
              </div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-orange-600 tracking-widest font-semibold bg-orange-100 rounded px-3 py-1 inline-block border border-orange-300">
              One last Mock shy
            </p>
          </div>

          {/* Subtitle - Updated content */}
          <p className="text-xl text-black w-full px-6 leading-normal font-normal">
            {/* A leading academic competition designed for A/L Physical Stream
            students in Kegalle District. Organized by the Kegalle Engineering
            Students' Society (KESS). */}
            KESS Inspire is a leading academic competition designed for 500+ A/L
            Physical Stream students in the Kegalle District. The program is
            conducted as a 3-day exam session consisting of 3 subject papers.
            After evaluation, students are ranked using a Z-score system, and
            gifts are awarded to the top performers to recognize their
            achievements and inspire excellence.
          </p>

          {/* Single Register Now Button */}
          <div className="flex justify-center items-center pt-2 ">
            {/* <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500 hover:to-blue-800 text-white font-semibold text-3xl px-24 py-10 rounded-full shadow-xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
            >
              Register Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button> */}
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-[#2D620A] backdrop-blur-md text-white-700 font-semibold text-2xl px-24 py-9 rounded-2xl border border-green-600 shadow-lg hover:bg-ice/90 hover:shadow-green-300/40 transition-all duration-300 transform hover:scale-105"
            >
              Register Now!
            </Button>
          </div>

          {/* Countdown Section */}
          <div className="pt-8 sm:pt-2">
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Get Ready!
              </h2>
              <div className="bg-green/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto">
                <Countdowntimer2 />
              </div>
            </div>
          </div>

          {/* Available Now Section - Glassmorphism Design */}
          <div className="pt-8 sm:pt-10 relative">
            {/* Floating glow effect */}
            <div className="absolute inset-0 -z-10">
              <div className="w-96 h-96 mx-auto bg-gradient-to-r from-green-400/20 via-blue-400/10 to-purple-400/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            </div>

            {/* Main card with advanced glassmorphism */}
            <div className="max-w-lg mx-auto relative group">
              {/* Outer glow ring */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-green-400/20 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-500"></div>

              {/* Main card */}
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl shadow-black/10 hover:shadow-green-500/20 transition-all duration-500 hover:bg-white/15 hover:border-white/30">
                {/* Header with animated badge */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full blur opacity-40 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <p className="text-sm sm:text-base font-bold bg-gradient-to-r from-green-700 to-blue-700 bg-clip-text text-transparent flex items-center">
                        <span className="mr-2 text-lg animate-bounce">🚀</span>
                        Available Now
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button with premium effects */}
                <a
                  href="/submissions"
                  className="relative block w-full group/button overflow-hidden"
                >
                  {/* Button background with animated gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-green-500/20 rounded-xl blur transition-all duration-300 group-hover/button:blur-md group-hover/button:scale-110"></div>

                  {/* Main button */}
                  <div className="relative flex items-center justify-center px-8 py-5 bg-gradient-to-r from-green-600/80 via-green-700/80 to-green-600/80 hover:from-green-500/90 hover:via-green-600/90 hover:to-green-500/90 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-green-500/25">
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine"></div>
                    </div>

                    {/* Button content */}
                    <div className="relative flex items-center text-white font-semibold">
                      <svg
                        className="w-6 h-6 mr-3 group-hover/button:rotate-12 group-hover/button:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-lg sm:text-xl mr-3">
                        📄 Document Submissions
                      </span>
                      <svg
                        className="w-5 h-5 group-hover/button:translate-x-2 group-hover/button:scale-110 transition-all duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </a>

                {/* Enhanced description */}
                <div className="mt-6 text-center">
                  <p className="text-sm sm:text-base text-gray-700/80 font-medium leading-relaxed">
                    Secure upload & instant NIC verification
                  </p>
                  <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-600/70">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      Fast Processing
                    </span>
                    <span className="flex items-center">
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      ></div>
                      Secure Upload
                    </span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
