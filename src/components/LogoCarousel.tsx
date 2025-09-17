import { useEffect, useState } from "react";

// Import all logo images
import logo2 from "@/assets/Logos/2.png";
import logo3 from "@/assets/Logos/3.png";
import logo4 from "@/assets/Logos/4.png";
import logo5 from "@/assets/Logos/5.png";
import logo6 from "@/assets/Logos/6.png";
import logo7 from "@/assets/Logos/7.png";
import logo8 from "@/assets/Logos/8.png";
import logo9 from "@/assets/Logos/9.png";
import logo10 from "@/assets/Logos/10.png";

const LogoCarousel = () => {
  const [logos, setLogos] = useState<string[]>([]);

  useEffect(() => {
    setLogos([logo2, logo3, logo4, logo5, logo6, logo7, logo8, logo9, logo10]);
  }, []);

  const LogoItem = ({ logoSrc, index }: { logoSrc: string; index: number }) => (
    <div
      key={`logo-${index}`}
      className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-2 flex items-center justify-center 
                 bg-card/10 backdrop-blur-sm border border-primary/20 rounded-lg
                 hover:border-primary/40 transition-colors duration-300"
    >
      <img
        src={logoSrc}
        alt={`Partner logo ${index + 1}`}
        className="w-full h-full object-contain p-2 rounded-lg"
      />
    </div>
  );

  // Duplicate logos ONCE for seamless looping
  const circularLogos = [...logos, ...logos];

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="flex w-max animate-scroll">
        {circularLogos.map((logoSrc, index) => (
          <LogoItem key={`logo-${index}`} logoSrc={logoSrc} index={index} />
        ))}
      </div>
    </div>
  );
};

export default LogoCarousel;
