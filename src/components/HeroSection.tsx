"use client";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter-animation";

const HeroSection = () => {
  const scrollToForm = () => {
    const element = document.querySelector("#student-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-slate-950/90 to-accent/10"></div>

      {/* Stars */}
      <div className="absolute top-20 left-10">
        <Star className="h-6 w-6 text-accent/40" />
      </div>
      <div className="absolute top-40 right-20">
        <Star className="h-4 w-4 text-primary-glow/30" />
      </div>
      <div className="absolute bottom-32 left-20">
        <Star className="h-5 w-5 text-accent/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
            <span className="text-sm font-medium text-primary-foreground">
              🏆 Academic Excellence Competition
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            KESS
            <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              INSPIRE
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            A leading academic competition designed for A/L Physical Stream
            students in Kegalle District. Organized by the Kegalle Engineering
            Students' Society (KESS).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg font-semibold group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .querySelector("#resources")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-primary-foreground/30 text-black hover:text-white hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300 px-8 py-4 text-lg"
            >
              Explore Resources
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 pt-16 border-t border-primary-foreground/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                <Counter target={500} suffix="+" />
              </div>
              <div className="text-primary-foreground/80">A/L Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                <Counter target={3} duration={1.5} />
              </div>
              <div className="text-primary-foreground/80">Day Competition</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                <Counter target={4} duration={1.5} />
              </div>
              <div className="text-primary-foreground/80">Subject Papers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
