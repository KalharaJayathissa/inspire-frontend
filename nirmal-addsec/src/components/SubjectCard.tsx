import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  imageUrl: string;
  paperCount: number;
}

export function SubjectCard({ subject, imageUrl, paperCount }: SubjectCardProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-[#ADBBDA]/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-[#EDF5F5]">
          <ImageWithFallback
            src={imageUrl}
            alt={subject}
            className="w-full h-full object-cover"
          />
        </div>
        
        <h3 className="text-xl font-semibold text-[#3D52A0] mb-4">{subject}</h3>
        
        <div className="space-y-3">
          {/* Marker Section Link */}
          <div className="flex items-center justify-between p-3 bg-[#EDF5F5] rounded-lg">
            <span className="text-[#7091E6] font-medium">Marker Section</span>
            <ArrowRight className="w-4 h-4 text-[#7091E6] cursor-pointer hover:text-[#3D52A0] transition-colors" />
          </div>
          
          {/* Paper Count */}
          <div className="flex items-center justify-between p-3 bg-[#ADBBDA]/30 rounded-lg">
            <span className="text-[#3D52A0] font-medium">Paper Count</span>
            <span className="text-[#3D52A0] font-bold text-lg">{paperCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}