"use client";
import { motion, easeOut } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Users, BookOpen, Target } from "lucide-react";

// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    year: "",
    goals: "",
    challenges: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = ["name", "email", "program", "goals"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application Submitted!", {
        description:
          "We'll review your application and get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        program: "",
        year: "",
        goals: "",
        challenges: "",
      });
    } catch (error) {
      toast.error("Submission Failed", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const programs = [
    "Mathematics Stream",
    "Physics Stream",
    "Chemistry Stream",
    "Biology Stream (Physics & Chemistry only)",
    "Combined Mathematics",
    "Other A/L Stream",
  ];

  const years = ["Grade 12", "Grade 13", "A/L Completed", "Repeat Student"];

  return (
    <motion.section
      id="student-form"
      className="py-16 sm:py-20 lg:py-24 bg-muted/30"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={stagger}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="text-center mb-12 sm:mb-16" variants={fadeUp}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Register for KESS Inspire
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join 500+ A/L Physical Stream students in Kegalle District for this
            3-day competitive examination covering Mathematics, Physics, and
            Chemistry.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Benefits */}
          <motion.div
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            variants={stagger}
          >
            {[
              {
                icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />,
                title: "Personalized Mentorship",
                desc: "Get matched with experienced mentors in your field of study.",
              },
              {
                icon: (
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                ),
                title: "Exclusive Resources",
                desc: "Access study materials, career guides, and academic tools.",
              },
              {
                icon: <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />,
                title: "Goal Achievement",
                desc: "Track your progress and celebrate your academic milestones.",
              },
              {
                icon: (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                ),
                title: "100% Free",
                desc: "All our services are completely free for students.",
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                className="flex items-start space-x-3 sm:space-x-4"
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  {benefit.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} className="order-1 lg:order-2">
            <Card className="card-gradient border-0 shadow-soft">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                  Competition Registration
                </CardTitle>
                <CardDescription className="text-center text-sm sm:text-base">
                  Register for the KESS Inspire Academic Competition
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Inputs */}
                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    variants={stagger}
                  >
                    <motion.div className="space-y-2" variants={fadeUp}>
                      <Label htmlFor="name" className="text-sm sm:text-base">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="h-10 sm:h-11"
                        required
                      />
                    </motion.div>
                    <motion.div className="space-y-2" variants={fadeUp}>
                      <Label htmlFor="email" className="text-sm sm:text-base">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="your.email@example.com"
                        className="h-10 sm:h-11"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={fadeUp}>
                    <Label htmlFor="phone" className="text-sm sm:text-base">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+1 (555) 123-4567"
                      className="h-10 sm:h-11"
                    />
                  </motion.div>

                  <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    variants={stagger}
                  >
                    <motion.div className="space-y-2" variants={fadeUp}>
                      <Label htmlFor="program" className="text-sm sm:text-base">
                        Program of Study *
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("program", value)
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Select your program" />
                        </SelectTrigger>
                        <SelectContent>
                          {programs.map((program) => (
                            <SelectItem key={program} value={program}>
                              {program}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                    <motion.div className="space-y-2" variants={fadeUp}>
                      <Label htmlFor="year" className="text-sm sm:text-base">
                        Academic Year
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleInputChange("year", value)
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-11">
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </motion.div>

                  <motion.div className="space-y-2" variants={fadeUp}>
                    <Label htmlFor="goals" className="text-sm sm:text-base">
                      Academic Goals *
                    </Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) =>
                        handleInputChange("goals", e.target.value)
                      }
                      placeholder="What are your academic and career goals?"
                      className="min-h-[80px] sm:min-h-[100px] resize-none"
                      required
                    />
                  </motion.div>

                  <motion.div className="space-y-2" variants={fadeUp}>
                    <Label
                      htmlFor="challenges"
                      className="text-sm sm:text-base"
                    >
                      Current Challenges
                    </Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) =>
                        handleInputChange("challenges", e.target.value)
                      }
                      placeholder="What challenges are you currently facing?"
                      className="min-h-[60px] sm:min-h-[80px] resize-none"
                    />
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 py-4 sm:py-6 text-base sm:text-lg font-semibold"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default StudentForm;
