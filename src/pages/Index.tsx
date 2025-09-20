import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import KessLogo from "@/assets/kess-logo-removebg-preview.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#95B695]">
      {/* Logo in top left corner */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
          <img 
            src={KessLogo} 
            alt="KESS Logo" 
            className="w-20 h-20 sm:w-10 sm:h-10 object-contain"
          />
          {/* <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            KESS INSPIRE
          </h1> */}
        </div>
      </div>
      
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default Index;
