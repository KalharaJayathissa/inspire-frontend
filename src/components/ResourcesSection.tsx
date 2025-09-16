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
} from "lucide-react";

const ResourcesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

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
    <section id="resources" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Competition Resources
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access study materials, past papers, and preparation guides for
            Mathematics, Physics, and Chemistry to excel in KESS Inspire.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={
                selectedCategory === category.value ? "default" : "outline"
              }
              onClick={() => setSelectedCategory(category.value)}
              className={`transition-all duration-200 ${
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="card-gradient border-0 shadow-soft hover:shadow-glow transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(resource.difficulty)}
                  >
                    {resource.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {resource.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {resource.downloads}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-hero text-primary-foreground hover:shadow-soft transition-all duration-300"
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
                    onClick={() => {
                      // Mock preview - In real implementation, this would show a preview
                      window.open(resource.url, "_blank");
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No resources found
            </h3>
            <p className="text-muted-foreground">
              Try selecting a different category or check back later for new
              resources.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground mr-2">📚</span>
            <span className="text-sm font-medium">
              New resources added weekly
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
