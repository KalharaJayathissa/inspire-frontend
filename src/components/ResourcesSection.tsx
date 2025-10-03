import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  ExternalLink,
  BookOpen,
  Download,
  Clock,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourcesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const resources = [
    {
      id: 1,
      title: "Mathematics Past Papers",
      description:
        "Previous year mathematics papers and model answers for A/L Combined Mathematics preparation.",
      type: "pdf",
      category: "mathematics",
      duration: "2-3 hours",
      difficulty: "Advanced",
      downloads: 1240,
      url: "#",
    },
    {
      id: 2,
      title: "Physics Practice Papers",
      description:
        "Comprehensive physics practice papers covering A/L syllabus with detailed solutions.",
      type: "pdf",
      category: "physics",
      duration: "3 hours",
      difficulty: "Advanced",
      downloads: 892,
      url: "#",
    },
    {
      id: 3,
      title: "Chemistry Model Papers",
      description:
        "A/L Chemistry practice papers with marking schemes and answer explanations.",
      type: "pdf",
      category: "chemistry",
      duration: "3 hours",
      difficulty: "Advanced",
      downloads: 2100,
      url: "#",
    },
    {
      id: 4,
      title: "Competition Guidelines",
      description:
        "Official KESS Inspire competition format, rules, and examination guidelines.",
      type: "pdf",
      category: "guidelines",
      duration: "30 minutes",
      difficulty: "Beginner",
      downloads: 756,
      url: "#",
    },
    {
      id: 5,
      title: "Study Schedule Template",
      description:
        "Effective study planning template for A/L students preparing for competitive exams.",
      type: "article",
      category: "preparation",
      duration: "15 minutes",
      difficulty: "Beginner",
      downloads: 643,
      url: "#",
    },
    {
      id: 6,
      title: "Z-Score Calculation Guide",
      description:
        "Understanding the Z-score system used for ranking and result calculation in KESS Inspire.",
      type: "pdf",
      category: "guidelines",
      duration: "45 minutes",
      difficulty: "Intermediate",
      downloads: 1870,
      url: "#",
    },
  ];

  const categories = [
    { value: "all", label: "All Resources" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "guidelines", label: "Guidelines" },
    { value: "preparation", label: "Preparation" },
  ];

  const filteredResources =
    selectedCategory === "all"
      ? resources
      : resources.filter((resource) => resource.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/10 text-success";
      case "Intermediate":
        return "bg-accent/10 text-accent";
      case "Advanced":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <section id="resources" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Competition Resources
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Access study materials, past papers, and preparation guides for
            Mathematics, Physics, and Chemistry to excel in KESS Inspire.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.value)}
              className={`transition-all duration-200 text-sm sm:text-base px-3 sm:px-4 py-2 ${
                selectedCategory === category.value
                  ? "bg-gradient-hero text-primary-foreground shadow-soft"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Featured Exam Papers Card */}
          {(selectedCategory === "all" ||
            ["mathematics", "physics", "chemistry"].includes(
              selectedCategory
            )) && (
            <Card className="card-gradient border-0 shadow-soft hover:shadow-glow transition-all duration-300 group bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full -translate-y-10 translate-x-10"></div>
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white border-0 text-xs sm:text-sm">
                    ⭐ Featured
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors">
                  Official Exam Papers
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Download comprehensive exam papers for Mathematics, Physics,
                  and Chemistry with modern interface and instant access.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>6 Papers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    Latest 2025
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base h-8 sm:h-10 shadow-lg hover:shadow-xl"
                  onClick={() => navigate("/exam-papers")}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  View All Papers
                </Button>
              </CardContent>
            </Card>
          )}

          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="card-gradient border-0 shadow-soft hover:shadow-glow transition-all duration-300 group"
            >
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getDifficultyColor(
                      resource.difficulty
                    )} text-xs sm:text-sm`}
                  >
                    {resource.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">
                      {resource.duration}
                    </span>
                    <span className="sm:hidden">
                      {resource.duration.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                    {resource.downloads}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-hero text-primary-foreground hover:shadow-soft transition-all duration-300 text-sm sm:text-base h-8 sm:h-10"
                    onClick={() => {
                      // Mock download/access - In real implementation, this would handle the actual resource access
                      window.open(resource.url, "_blank");
                    }}
                  >
                    {resource.type === "video" ? "Watch" : "Download"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => {
                      // Mock preview - In real implementation, this would show a preview
                      window.open(resource.url, "_blank");
                    }}
                  >
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No resources found
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Try selecting a different category or check back later for new
              resources.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground mr-2">📚</span>
            <span className="text-xs sm:text-sm font-medium">
              New resources added weekly
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
