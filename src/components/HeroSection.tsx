"use client";
import { ArrowRight, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter-animation";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  
  const scrollToForm = () => {
    const element = document.querySelector("#student-form");
    if (element) {
      const navHeight = window.innerWidth >= 768 ? 80 : 64; // md:h-20 = 80px, h-16 = 64px
      const elementPosition = (element as HTMLElement).offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const goToComingSoon = () => {
    navigate("/coming-soon");
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden pt-20 sm:pt-24 md:pt-28"
    >
      {/* Background decoration - Modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-black"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/5 via-transparent to-purple-500/5"></div>

      {/* Geometric decorative elements */}
      <div className="absolute top-20 left-8 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-8 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Modern floating elements */}
      <div className="absolute top-32 left-16 w-4 h-4 bg-orange-400/40 rounded-full animate-pulse"></div>
      <div className="absolute top-48 right-24 w-6 h-6 bg-purple-400/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-24 w-5 h-5 bg-blue-400/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* Badge - Modern style */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl">
            <span className="text-sm sm:text-base font-medium text-white/90 flex items-center space-x-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span>🏆 Academic Excellence Competition</span>
            </span>
          </div>

          {/* Main Title - Clean, modern layout */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-none">
                KESS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">INSPIRE</span>
              </h1>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-orange-400/90">2025</div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-white/70 tracking-widest font-light">
              KEGALLE ENGINEERING STUDENTS' SOCIETY
            </p>
          </div>

          {/* Subtitle - Better typography */}
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
            A leading academic competition designed for A/L Physical Stream
            students in Kegalle District. Organized by the Kegalle Engineering
            Students' Society (KESS).
          </p>

          {/* CTA Buttons - Modern card-style layout */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
            >
              Start Your Journey
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .querySelector("#resources")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white/20 text-white hover:text-black hover:bg-white/90 hover:border-white transition-all duration-300 px-10 py-4 rounded-full text-lg backdrop-blur-sm"
            >
              Explore Resources
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={goToComingSoon}
              className="border-2 border-purple-400/50 text-purple-400 hover:text-white hover:bg-purple-500/20 hover:border-purple-400 transition-all duration-300 px-10 py-4 rounded-full text-lg backdrop-blur-sm group"
            >
              <Eye className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
              Preview Coming Soon
            </Button>
          </div>

          {/* Stats - Modern card design */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 sm:pt-20 lg:pt-24">
            {[
              { number: 500, suffix: "+", label: "A/L Students" },
              { number: 3, suffix: "", label: "Day Competition" },
              { number: 4, suffix: "", label: "Subject Papers" }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-400 mb-3">
                  <Counter target={stat.number} suffix={stat.suffix} duration={1.5} />
                </div>
                <div className="text-sm sm:text-base text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
