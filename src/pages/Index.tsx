import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ResourcesSection from "@/components/ResourcesSection";
import KessLogo from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo in top left corner */}
      <div className="fixed top-2 left-2 sm:top-4 sm:left-4 md:top-6 md:left-6 lg:top-8 lg:left-8 z-50">
        <div className="flex items-center space-x-3 bg-ice/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-gray-200">
          <img
            src={KessLogo}
            alt="KESS Logo"
            className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 max-w-full object-contain"
            style={{ height: "auto" }}
          />
          {/* <h1 className="text-lg sm:text-xl font-bold text-[#FFD700]">
            KESS
          </h1> */}
        </div>
      </div>
      <HeroSection />
      <AboutSection />
      {/* <ResourcesSection /> */}
    </div>
  );
};

export default Index;
