import { GraduationCap, Users, Target, BookOpen } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import Timeline from "./Timeline";
import EducationBackground from "./EducationBackground";
import LogoCarousel from "./LogoCarousel";

const AboutSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-orange-500" />,
      title: "Academic Excellence",
      description:
        "Empowering A/L Physical Stream students through competitive examinations and academic challenges.",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "University Connection",
      description:
        "Direct interaction with engineering students from University of Moratuwa to bridge the gap to higher education.",
    },
    {
      icon: <Target className="h-8 w-8 text-orange-500" />,
      title: "Student Motivation",
      description:
        "Z-score ranking system with awards to recognize achievements and inspire excellence in education.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-orange-500" />,
      title: "Comprehensive Subjects",
      description:
        "Covers Mathematics, Physics, and Chemistry for both Maths stream and Bio stream students.",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-32 xl:py-24 relative overflow-hidden bg-gray-50 ">
      {/* Shared education-themed light green background */}
      <EducationBackground />

  <div className="container mx-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
      <Timeline />
  <div className="max-w-4xl mx-auto mt-12">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              About KESS
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              The Kegalle Engineering Students' Society (KESS) is a collective
              of engineering graduates & undergraduates from the University of
              Moratuwa united by a vision to apply knowledge for meaningful
              change. More than a student body, KESS is a platform for academic
              growth, leadership, and community impact.
            </p>
          </div>

          {/* Mission Statement */}
          {/* <div className="bg-white rounded-xl lg:rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 shadow-lg border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center">
              What is KESS Inspire?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
              KESS Inspire is a leading academic competition designed for 500+
              A/L Physical Stream students in the Kegalle District. The program
              is conducted as a 3-day exam session consisting of 3 subject
              papers. After evaluation, students are ranked using a Z-score
              system, and gifts are awarded to the top performers to recognize
              their achievements and inspire excellence.
            </p>
          </div> */}

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {features.map((feature, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="p-4 sm:p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0 mt-1 sm:mt-0">
                      {feature.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
          <div className="text-center mb-2 sm:mb-3 md:mb-4">
            <p className="text-sm sm:text-base md:text-lg text-white/50 font-light px-4 sm:px-6">
              Trusted by Leading Schools
            </p>
          </div>
          {/* Logo Carousel with green borders and background-removed images */}
          
        </div>
      </div>
      <div className="my-4">
            <LogoCarousel />
          </div>
    </section>
  );
};

export default AboutSection;
