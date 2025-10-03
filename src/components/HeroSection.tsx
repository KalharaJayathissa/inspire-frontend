"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { useNavigate } from "react-router-dom";
import Countdowntimer2 from "./Countdowntimer2";
import BackgroundImg from "@/assets/Background.jpg";
import RegisterButton from "./RegisterButton";

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

          {/* Action Buttons - Register Now, Submit Answers, and Exam Papers */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 pt-4">
            <RegisterButton
              label="Register Now!"
              navigateTo="/register"
              onClick={scrollToForm}
              variant="primary"
              icon="arrow"
            />
            <RegisterButton
              label="📄 Submit Answers"
              navigateTo="/submissions"
              variant="secondary"
              icon="upload"
            />
            <RegisterButton
              label="📚 Exam Papers"
              navigateTo="/exam-papers"
              variant="tertiary"
              icon="document"
            />
          </div>

          {/* Countdown Section */}
          <div className="pt-8 sm:pt-2">
            <div className="text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Get Ready!
              </h2>
              {/* <div className="bg-green/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto">
                <Countdowntimer2 />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
