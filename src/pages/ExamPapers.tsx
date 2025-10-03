import React, { useState } from "react";
import {
  Download,
  FileText,
  Search,
  Filter,
  BookOpen,
  GraduationCap,
  Atom,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  part?: string;
  year: string;
  fileSize: string;
  fileName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ExamPapers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const examPapers: ExamPaper[] = [
    {
      id: "1",
      title: "Chemistry Part I",
      subject: "Chemistry",
      part: "Part I",
      year: "2025",
      fileSize: "2.4 MB",
      fileName: "Chemistry part I ©2025 KESS Inspire.pdf",
      description:
        "Comprehensive chemistry examination covering organic and inorganic chemistry fundamentals",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      id: "2",
      title: "Chemistry Part II",
      subject: "Chemistry",
      part: "Part II",
      year: "2025",
      fileSize: "2.1 MB",
      fileName: "Chemistry part II ©2025 KESS Inspire.pdf",
      description:
        "Advanced chemistry concepts including physical chemistry and analytical methods",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      id: "3",
      title: "Mathematics Applied",
      subject: "Mathematics",
      part: "Applied",
      year: "2025",
      fileSize: "1.8 MB",
      fileName: "Mathematics Applied ©2025 KESS Inspire.pdf",
      description:
        "Applied mathematics covering calculus, statistics, and real-world problem solving",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      id: "4",
      title: "Mathematics Pure",
      subject: "Mathematics",
      part: "Pure",
      year: "2025",
      fileSize: "2.0 MB",
      fileName: "Mathematics Pure ©KESS Inspire.pdf",
      description:
        "Pure mathematics including algebra, geometry, and mathematical proofs",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      id: "5",
      title: "Physics Part I",
      subject: "Physics",
      part: "Part I",
      year: "2025",
      fileSize: "2.3 MB",
      fileName: "Pyshics part I ©2025 KESS Inspire.pdf",
      description:
        "Fundamental physics concepts including mechanics, waves, and thermodynamics",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
    {
      id: "6",
      title: "Physics Part II",
      subject: "Physics",
      part: "Part II",
      year: "2025",
      fileSize: "2.5 MB",
      fileName: "Physics part II ©2025 KESS inspire.pdf",
      description:
        "Advanced physics topics including electromagnetism and quantum mechanics",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
  ];

  const subjects = ["all", "Chemistry", "Mathematics", "Physics"];

  const filteredPapers = examPapers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.part &&
        paper.part.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject =
      selectedSubject === "all" || paper.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDownload = (fileName: string, title: string) => {
    const link = document.createElement("a");
    link.href = `/exam_papers/${fileName}`;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSubjectStats = () => {
    const stats = subjects.slice(1).map((subject) => ({
      subject,
      count: examPapers.filter((paper) => paper.subject === subject).length,
    }));
    return stats;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-25 to-lime-50 relative">
      {/* Background similar to Timeline component */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-green-100 via-green-50 to-green-200 opacity-60 rounded-3xl blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-200 via-green-100 to-green-50 opacity-40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-green-100 opacity-30 rounded-full blur-2xl"></div>
      </div>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-lg border border-green-500/30">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Exam Papers Library
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access comprehensive exam papers for Chemistry, Mathematics, and
              Physics. Download high-quality PDFs to enhance your preparation
              and academic success.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {examPapers.length}
              </div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                Total Papers
              </div>
            </div>
            {getSubjectStats().map((stat, index) => (
              <div key={stat.subject} className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {stat.subject}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-200/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search exam papers by subject, title, or part..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-green-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Filter by:
                  </span>
                </div>
                {subjects.map((subject) => (
                  <Button
                    key={subject}
                    variant={
                      selectedSubject === subject ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    className={`capitalize ${
                      selectedSubject === subject
                        ? "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white"
                        : "hover:bg-green-50"
                    }`}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Papers Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredPapers.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                No papers found
              </h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPapers.map((paper, index) => (
                <Card
                  key={paper.id}
                  className="group hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-3 rounded-xl ${paper.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {paper.icon}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        {paper.year}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {paper.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Subject:</span>
                        <Badge variant="outline" className="font-medium">
                          {paper.subject} {paper.part && `- ${paper.part}`}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">File Size:</span>
                        <span className="font-medium text-gray-700">
                          {paper.fileSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span className="truncate">{paper.fileName}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() =>
                        handleDownload(paper.fileName, paper.title)
                      }
                      className="w-full h-12 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-[0_15px_35px_rgba(34,197,94,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 group border border-white/20"
                    >
                      <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Download Paper
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Need Help with Your Studies?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                These exam papers are designed to help you prepare effectively.
                Each paper contains carefully curated questions that reflect the
                current curriculum and exam patterns.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    High Quality
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professionally crafted exam papers
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Comprehensive
                  </h3>
                  <p className="text-sm text-gray-600">
                    Covers all essential topics
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Exam Ready
                  </h3>
                  <p className="text-sm text-gray-600">
                    Formatted for actual exam conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default ExamPapers;
