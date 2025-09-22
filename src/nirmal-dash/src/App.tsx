import { InfoBar } from "./components/InfoBar";
import { SubjectCard } from "./components/SubjectCard";
import { InstructionsSection } from "./components/InstructionsSection";

const subjects = [
  {
    name: "Combined Mathematics",
    imageUrl: "https://images.unsplash.com/photo-1676302440263-c6b4cea29567?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMGJvb2t8ZW58MXx8fHwxNzU4MzQxMTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    paperCount: 23
  },
  {
    name: "Physics",
    imageUrl: "https://images.unsplash.com/photo-1628641538565-135707638a61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwbGFib3JhdG9yeSUyMHNjaWVuY2V8ZW58MXx8fHwxNzU4MzQ2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    paperCount: 18
  },
  {
    name: "Chemistry",
    imageUrl: "https://images.unsplash.com/photo-1616996692022-60cb0f438b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBsYWIlMjBiZWFrZXJ8ZW58MXx8fHwxNzU4MzQ2OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    paperCount: 15
  }
];

export default function App() {
  return (
    <div className="min-h-screen relative">
      {/* Blurred Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTgzNDAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#7091E6]/20 via-[#8697C4]/30 to-[#ADBBDA]/20" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Info Bar */}
        <InfoBar />
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject.name}
                imageUrl={subject.imageUrl}
                paperCount={subject.paperCount}
              />
            ))}
          </div>
          
          {/* Instructions Section */}
          <InstructionsSection />
        </div>
      </div>
    </div>
  );
}