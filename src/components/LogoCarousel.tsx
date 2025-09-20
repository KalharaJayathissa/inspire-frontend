import { useEffect, useState } from "react";

// Import all logo images
// Use images from background-removed folder
const logoPaths = [
  '/src/assets/background-removed-logos/2-removebg-preview.webp',
  '/src/assets/background-removed-logos/3-removebg-preview.webp',
  '/src/assets/background-removed-logos/4-removebg-preview.webp',
  '/src/assets/background-removed-logos/5-removebg-preview.webp',
  '/src/assets/background-removed-logos/6-removebg-preview.webp',
  '/src/assets/background-removed-logos/7-removebg-preview.webp',
  '/src/assets/background-removed-logos/8-removebg-preview.webp',
  '/src/assets/background-removed-logos/9-removebg-preview.webp',
  '/src/assets/background-removed-logos/10-removebg-preview.webp',
];

const LogoCarousel = () => {
  const [logos, setLogos] = useState<string[]>([]);

  useEffect(() => {
    setLogos(logoPaths);
  }, []);

  const LogoItem = ({ logoSrc, index }: { logoSrc: string; index: number }) => (
    <div
      key={`logo-${index}`}
      className="flex-shrink-0 w-22 h-22 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-2 flex items-center justify-center 
                 bg-card/10 backdrop-blur-sm border-2 border-green-700 rounded-lg
                 hover:border-green-900 transition-colors duration-300"
    >
      <img
        src={logoSrc}
        alt={`Partner logo ${index + 1}`}
        className="w-20 h-auto sm:w-28 md:w-36 lg:w-44 object-contain p-2 rounded-lg mx-auto"
      />

    </div>
  );

  // Duplicate logos multiple times for seamless infinite scroll
  const circularLogos = Array(6).fill(logos).flat();

  return (
    <div className="w-full overflow-hidden py-6">
      <div className="flex logo-carousel-scroll" style={{ minWidth: '600%', width: 'max-content' }}>
        {circularLogos.map((logoSrc, index) => (
          <LogoItem key={`logo-${index}`} logoSrc={logoSrc} index={index} />
        ))}
      </div>
      <style>{`
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16.66%); }
        }
        .logo-carousel-scroll {
          animation: logo-scroll 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoCarousel;
