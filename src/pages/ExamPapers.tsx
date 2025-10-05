import React, { useState, useEffect } from "react";
import {
  Download,
  FileText,
  Search,
  Filter,
  BookOpen,
  GraduationCap,
  Atom,
  Calculator,
  TrendingDown,
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
import { getAllDownloadCounts, incrementDownloadCount } from "@/services/api";

/**
 * Default download count fallback value for UI display
 * This should match the DEFAULT_DOWNLOAD_COUNT in api.ts
 * Used when download counts cannot be loaded from backend
 */
const DEFAULT_DOWNLOAD_COUNT = 0;

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
  medium: string;
  downloadCount?: number;
}

const ExamPapers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(
    {}
  );

  const examPapers: ExamPaper[] = [
    {
      id: "1",
      title: "Chemistry Part I",
      subject: "Chemistry",
      part: "Part I",
      year: "2025",
      fileSize: "5.4 MB",
      fileName: "Chemistry part I ©2025 KESS Inspire.pdf",
      description:
        "Comprehensive chemistry examination covering organic and inorganic chemistry fundamentals",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      medium: "සිංහල",
    },
    {
      id: "2",
      title: "Chemistry Part II",
      subject: "Chemistry",
      part: "Part II",
      year: "2025",
      fileSize: "8.5 MB",
      fileName: "Chemistry part II ©2025 KESS Inspire.pdf",
      description:
        "Advanced chemistry concepts including physical chemistry and analytical methods",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      medium: "සිංහල",
    },
    {
      id: "3",
      title: "Mathematics Applied",
      subject: "Mathematics",
      part: "Applied",
      year: "2025",
      fileSize: "1.9 MB",
      fileName: "Mathematics Applied ©2025 KESS Inspire.pdf",
      description:
        "Applied mathematics covering calculus, statistics, and real-world problem solving",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      medium: "සිංහල",
    },
    {
      id: "4",
      title: "Mathematics Pure",
      subject: "Mathematics",
      part: "Pure",
      year: "2025",
      fileSize: "522 KB",
      fileName: "Mathematics Pure ©KESS Inspire.pdf",
      description:
        "Pure mathematics including algebra, geometry, and mathematical proofs",
      icon: <Calculator className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600",
      medium: "සිංහල",
    },
    {
      id: "5",
      title: "Physics Part I",
      subject: "Physics",
      part: "Part I",
      year: "2025",
      fileSize: "833 KB",
      fileName: "Pyshics part I ©2025 KESS Inspire.pdf",
      description:
        "Fundamental physics concepts including mechanics, waves, and thermodynamics",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      medium: "සිංහල",
    },
    {
      id: "6",
      title: "Physics Part II",
      subject: "Physics",
      part: "Part II",
      year: "2025",
      fileSize: "1.4 MB",
      fileName: "Physics part II ©2025 KESS inspire.pdf",
      description:
        "Advanced physics topics including electromagnetism and quantum mechanics",
      icon: <Atom className="w-6 h-6" />,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      medium: "සිංහල",
    },
  ];

  const subjects = ["all", "Chemistry", "Mathematics", "Physics"];

  // Fetch all download counts at once (more efficient)
  useEffect(() => {
    const fetchAllDownloadCounts = async () => {
      const paperIds = examPapers.map((paper) => paper.id);
      try {
        const counts = await getAllDownloadCounts(paperIds);
        setDownloadCounts(counts);
      } catch (error) {
        console.error("Failed to fetch download counts:", error);
        // Set default counts for all papers
        const defaultCounts: Record<string, number> = {};
        paperIds.forEach((id) => {
          defaultCounts[id] = DEFAULT_DOWNLOAD_COUNT;
        });
        setDownloadCounts(defaultCounts);
      }
    };

    fetchAllDownloadCounts();
  }, []);

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

  const handleDownload = async (
    fileName: string,
    title: string,
    paperId: string
  ) => {
    try {
      // Increment download count through backend API
      const newCount = await incrementDownloadCount(paperId);

      // Update local download count state
      setDownloadCounts((prev) => ({
        ...prev,
        [paperId]: newCount,
      }));

      // Trigger the actual download
      const link = document.createElement("a");
      link.href = `/exam_papers/${fileName}`;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to track download:", error);
      // Still allow download even if tracking fails
      const link = document.createElement("a");
      link.href = `/exam_papers/${fileName}`;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getSubjectStats = () => {
    const stats = subjects.slice(1).map((subject) => ({
      subject,
      count: examPapers.filter((paper) => paper.subject === subject).length,
    }));
    return stats;
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-r from-lime-100 to-teal-100
 from-green-50 via-green-25 to-lime-50 relative"
    >
      {/* Background similar to Timeline component */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gradient-to-br from-green-100 via-green-50 to-green-200 opacity-60 rounded-3xl blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tr from-green-200 via-green-100 to-green-50 opacity-40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/2 w-40 h-40 bg-green-100 opacity-30 rounded-full blur-2xl"></div>
      </div>
      {/* <Navigation /> */}

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
            {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed text-center mb-8">
              Explore a curated collection of comprehensive exam papers in
              Chemistry, Mathematics, and Physics, thoughtfully prepared by the
              Kegalle Engineering Students' Society (KESS) to support your
              academic journey. <br/>© All rights reserved.
            </p> */}
            <p className="text-sm text-gray-500 text-center mt-4">
              © All exam papers and related materials are the intellectual
              property of the Kegalle Engineering Students' Society (KESS).
              Unauthorized copying, distribution, or reproduction of these
              resources is strictly prohibited. All rights reserved.
            </p>
            `{/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-gray-600 font-medium">
                  Not registered yet?
                </span>
                <Button
                  onClick={() => (window.location.href = "/register")}
                  className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-[0_10px_25px_rgba(34,197,94,0.3)] hover:scale-105 transition-all duration-300"
                >
                  Register Now
                </Button>
              </div>

              <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-gray-600 font-medium">
                  Submit your answers:
                </span>
                <Button
                  onClick={() => (window.location.href = "/submissions")}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-[0_10px_25px_rgba(99,102,241,0.3)] hover:scale-105 transition-all duration-300"
                >
                  Submissions
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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
          </div> */}
        </div>
      </section>

      {/* Search and Filter Section */}
      {/* <section className="px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
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
      </section> */}

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
                    {/* <CardDescription className="text-gray-600 leading-relaxed">
                      {paper.description}
                    </CardDescription> */}
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        {/* <span className="text-gray-500">Subject:</span> */}
                        {/* <Badge variant="outline" className="font-medium">
                          {paper.subject} {paper.part && `- ${paper.part}`}
                        </Badge> */}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">File Size:</span>
                        <span className="font-medium text-gray-700">
                          {paper.fileSize}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Downloads:</span>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-gray-700">
                            {downloadCounts[paper.id] !== undefined
                              ? `${downloadCounts[paper.id]}+`
                              : `${DEFAULT_DOWNLOAD_COUNT}+`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Medium:</span>
                        <span className="font-medium text-gray-700">
                          {paper.medium}
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
                        handleDownload(paper.fileName, paper.title, paper.id)
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
                A social service by KESS
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

      {/* Copyright Footer */}
      <div className="text-center py-8 border-t border-green-200/50 bg-white/30 backdrop-blur-sm">
        <p className="text-sm text-gray-700 font-medium tracking-wide">
          © 2025 Kegalle Engineering Students' Society (KESS). All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default ExamPapers;
