import { GraduationCap, Users, Target, BookOpen } from "lucide-react";
import { ScrollAnimation } from "@/components/ui/scroll-animation";

const AboutSection = () => {
  const features = [
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Academic Excellence",
      description:
        "Empowering A/L Physical Stream students through competitive examinations and academic challenges.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "University Connection",
      description:
        "Direct interaction with engineering students from University of Moratuwa to bridge the gap to higher education.",
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Student Motivation",
      description:
        "Z-score ranking system with awards to recognize achievements and inspire excellence in education.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Comprehensive Subjects",
      description:
        "Covers Mathematics, Physics, and Chemistry for both Maths stream and Bio stream students.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              About KESS
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The Kegalle Engineering Students' Society (KESS) is a collective
              of engineering graduates & undergraduates from the University of
              Moratuwa united by a vision to apply knowledge for meaningful
              change. More than a student body, KESS is a platform for academic
              growth, leadership, and community impact.
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-card rounded-2xl p-8 mb-12 shadow-soft border">
            <h3 className="text-2xl font-semibold text-foreground mb-4 text-center">
              What is KESS Inspire?
            </h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              KESS Inspire is a leading academic competition designed for 500+
              A/L Physical Stream students in the Kegalle District. The program
              is conducted as a 3-day exam session consisting of 4 subject
              papers. After evaluation, students are ranked using a Z-score
              system, and gifts are awarded to the top performers to recognize
              their achievements and inspire excellence.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <ScrollAnimation key={index} delay={index * 0.1}>
                <div className="p-6 bg-background rounded-lg shadow-soft hover:shadow-glow transition-shadow duration-300">
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* Objectives */}
          <div className="mt-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border">
            <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Our Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollAnimation delay={0.3}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong>Student Motivation:</strong> Encourage students to
                      study diligently and perform at their best through
                      competitive examination.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong>Academic Improvement:</strong> Raise the number of
                      merit pass students by identifying potential early and
                      providing academic challenges.
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation delay={0.4}>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong>Bridge to Higher Education:</strong> Connect
                      students with university-level engineering students to
                      prepare them for future academic journeys.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong>Community Impact:</strong> Build lasting
                      relationships between schools and KESS, enhancing academic
                      reputation in the district.
                    </p>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
