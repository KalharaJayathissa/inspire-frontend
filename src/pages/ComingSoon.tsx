import { useEffect, useState } from 'react';
import LightRays from '@/components/LightRays';
import CountdownTimer from '@/components/CountdownTimer';
import LogoCarousel from '@/components/LogoCarousel';
import KessLogo from '@/assets/kess-logo.png';

const ComingSoon = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Handle component mounting
    setIsMounted(true);
    
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  // Prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Mobile Enhancement Background - starting below header */}
      <div className="fixed top-16 left-0 right-0 bottom-0 z-0 md:hidden bg-gradient-to-b from-yellow-500/5 via-yellow-400/2 to-transparent"></div>
      
      {/* Mobile Top Glow Effect - below header */}
      <div className="fixed top-16 left-0 right-0 h-32 z-[1] md:hidden bg-gradient-to-b from-yellow-400/8 via-yellow-400/3 to-transparent blur-xl"></div>
      
      {/* CSS Fallback Light Rays for Mobile - Enhanced, starting below header */}
      <div className="fixed top-16 left-0 right-0 bottom-0 z-[2] md:hidden pointer-events-none">
        {/* Main center ray - much longer and softer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-96 bg-gradient-to-b from-yellow-400/15 via-yellow-400/8 to-transparent blur-lg animate-pulse"></div>
        
        {/* Side rays - very long and subtle */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-10 w-4 h-88 bg-gradient-to-b from-yellow-400/12 via-yellow-400/6 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-10 w-4 h-88 bg-gradient-to-b from-yellow-400/12 via-yellow-400/6 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        
        {/* Medium rays - extended to full mobile height */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-20 w-3 h-80 bg-gradient-to-b from-yellow-400/10 via-yellow-400/5 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-20 w-3 h-80 bg-gradient-to-b from-yellow-400/10 via-yellow-400/5 to-transparent blur-lg animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        
        {/* Outer rays - very long reach */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-35 w-2 h-76 bg-gradient-to-b from-yellow-400/8 via-yellow-400/4 to-transparent blur-lg animate-pulse" style={{ animationDelay: '1.0s' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-35 w-2 h-76 bg-gradient-to-b from-yellow-400/8 via-yellow-400/4 to-transparent blur-lg animate-pulse" style={{ animationDelay: '1.2s' }}></div>
        
        {/* Wide outer rays - nearly full screen */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-50 w-2 h-72 bg-gradient-to-b from-yellow-300/7 via-yellow-300/3 to-transparent blur-lg animate-pulse" style={{ animationDelay: '1.4s' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-50 w-2 h-72 bg-gradient-to-b from-yellow-300/7 via-yellow-300/3 to-transparent blur-lg animate-pulse" style={{ animationDelay: '1.6s' }}></div>
        
        {/* Extreme outer rays - full screen reach */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 rotate-65 w-1 h-68 bg-gradient-to-b from-yellow-300/6 via-yellow-300/2 to-transparent blur-lg animate-pulse" style={{ animationDelay: '1.8s' }}></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-65 w-1 h-68 bg-gradient-to-b from-yellow-300/6 via-yellow-300/2 to-transparent blur-lg animate-pulse" style={{ animationDelay: '2.0s' }}></div>
      </div>
      
      {/* Light Rays Background - Behind content, starting below header */}
      <div className="fixed top-16 left-0 right-0 bottom-0 z-[1]" style={{ mixBlendMode: 'screen' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#FFD700"
          raysSpeed={2.0}
          lightSpread={0.6}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.02}
          distortion={0.01}
          className="w-full h-full"
        />
      </div>

      {/* Additional Light Rays - Above content for mobile visibility, starting below header */}
      <div className="fixed top-16 left-0 right-0 bottom-0 z-[15] pointer-events-none md:hidden" style={{ mixBlendMode: 'overlay' }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="#FFFF00"
          raysSpeed={1.5}
          lightSpread={0.4}
          rayLength={1.0}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.01}
          distortion={0.005}
          className="w-full h-full opacity-25"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar - Enhanced Mobile Responsive */}
        <header 
          className={`w-full py-3 px-4 sm:py-4 sm:px-6 md:py-6 md:px-12 border-b border-primary/30 bg-card/5 md:bg-card/5 backdrop-blur-sm md:backdrop-blur-md transition-all duration-700 ${
            isLoaded ? 'animate-fade-in-up translate-y-0 opacity-100' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div className="flex items-center justify-center sm:justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img 
                src={KessLogo} 
                alt="Kess Inspire Logo" 
                className={`w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 rounded-lg shadow-lg transition-all duration-500 ${
                  isLoaded ? 'animate-glow-pulse scale-100' : 'scale-0'
                }`}
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-white tracking-wide">
                <span className="text-primary">K</span>ESS Inspire
              </h1>
            </div>
          </div>
        </header>

        {/* Main Content Area - Enhanced Mobile Layout */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          {/* Clean Coming Soon Section */}
          <div 
            className={`mb-6 sm:mb-8 md:mb-12 lg:mb-16 text-center max-w-4xl mx-auto transition-all duration-700 delay-200 ${
              isLoaded ? 'animate-fade-in-up translate-y-0 opacity-100' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main Heading - Light font and Much Bigger Mobile Size */}
            <h2 className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-light mb-4 sm:mb-6 md:mb-8 lg:mb-12 text-white tracking-wider leading-tight">
              COMING SOON
            </h2>
            
            {/* Subtitle - Mobile Optimized */}
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 mb-8 sm:mb-10 md:mb-12 lg:mb-20 max-w-3xl mx-auto leading-relaxed font-light px-2 sm:px-4">
              Something extraordinary is on the horizon. Prepare to be inspired.
            </p>
            
            {/* Countdown Timer - Mobile Responsive Container */}
            <div 
              className={`mb-8 sm:mb-10 md:mb-12 lg:mb-16 transition-all duration-700 delay-300 ${
                isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            >
              <CountdownTimer />
            </div>
            
            {/* Bottom Text - Mobile Optimized */}
            <div 
              className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 font-light transition-all duration-700 delay-400 px-2 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              The One Last Mock Shy Before Exam
            </div>
          </div>
        </main>

        {/* Logo Carousel - Enhanced Mobile */}
        <div 
          className={`transition-all duration-700 delay-500 mb-4 sm:mb-6 md:mb-8 ${
            isLoaded ? 'animate-fade-in-up translate-y-0 opacity-100' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-center mb-2 sm:mb-3 md:mb-4">
            <p className="text-sm sm:text-base md:text-lg text-white/50 font-light px-4 sm:px-6">
              Trusted by Leading Schools
            </p>
          </div>
          <LogoCarousel />
        </div>

        {/* Footer - Mobile Enhanced */}
        <footer 
          className={`py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 lg:px-12 text-center border-t border-primary/20 bg-card/3 md:bg-card/5 backdrop-blur-sm md:backdrop-blur-md transition-all duration-700 delay-600 ${
            isLoaded ? 'animate-fade-in-up translate-y-0 opacity-100' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm sm:text-base text-white/50 font-light">
            © 2025 KESS Inspire. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Ambient glow effects - Mobile Optimized */}
      <div 
        className={`fixed top-1/4 left-1/4 w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-primary/5 rounded-full blur-2xl sm:blur-3xl transition-all duration-1000 ${
          isLoaded ? 'animate-pulse scale-100 opacity-100' : 'scale-0 opacity-0'
        }`} 
      />
      <div 
        className={`fixed bottom-1/4 right-1/4 w-32 h-32 xs:w-40 xs:h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-accent/5 rounded-full blur-2xl sm:blur-3xl transition-all duration-1000 delay-1000 ${
          isLoaded ? 'animate-pulse scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      />
    </div>
  );
};

export default ComingSoon;