"use client";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter-animation";

const HeroSection = () => {
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

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden hero-section-foldable pt-12 sm:pt-16 md:pt-20"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-950/90 to-accent/10"></div>

      {/* Stars - Responsive positioning */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-10">
        <Star className="h-4 w-4 sm:h-6 sm:w-6 text-accent/40" />
      </div>
      <div className="absolute top-32 sm:top-40 right-8 sm:right-20">
        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-primary-glow/30" />
      </div>
      <div className="absolute bottom-24 sm:bottom-32 left-8 sm:left-20">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-accent/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto hero-content-fold">
          {/* Badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8 sm:mb-10 lg:mb-12 hero-badge-foldable">
            <span className="text-xs sm:text-sm font-medium text-primary-foreground">
              🏆 Academic Excellence Competition
            </span>
          </div>

          {/* Logo and Title */}
          <div className="mb-10 sm:mb-12 lg:mb-16 hero-logo-foldable">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-3 sm:space-y-0">
              <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-wider text-center sm:text-left">
                KESS <span className="text-orange-400">INSPIRE</span>
              </div>
              <div className="sm:ml-4 text-orange-400 text-2xl sm:text-3xl lg:text-4xl font-bold">2025</div>
              <div className="sm:ml-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-400 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="text-white text-sm sm:text-base lg:text-lg tracking-widest font-light mt-4 sm:mt-6">
              KEGALLE ENGINEERING STUDENTS' SOCIETY
            </div>
          </div>

     






          {/* Main heading */}
          {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            KESS
            <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              INSPIRE
            </span>
          </h1> */}

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/90 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 mt-4 sm:mt-6 hero-subtitle-foldable">
            A leading academic competition designed for A/L Physical Stream
            students in Kegalle District. Organized by the Kegalle Engineering
            Students' Society (KESS).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 sm:px-0 mb-8 sm:mb-10 hero-buttons-foldable">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-glow transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group w-full sm:w-auto"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .querySelector("#resources")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-primary-foreground/30 text-black hover:text-white hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
            >
              Explore Resources
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20 lg:mt-24 pt-12 sm:pt-16 lg:pt-20 border-t border-primary-foreground/20 px-4 sm:px-0 hero-stats-foldable">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-2">
                <Counter target={500} suffix="+" />
              </div>
              <div className="text-sm sm:text-base text-primary-foreground/80">A/L Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-2">
                <Counter target={3} duration={1.5} />
              </div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Day Competition</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent mb-2">
                <Counter target={4} duration={1.5} />
              </div>
              <div className="text-sm sm:text-base text-primary-foreground/80">Subject Papers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
