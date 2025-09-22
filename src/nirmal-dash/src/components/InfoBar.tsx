import { Bell, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function InfoBar() {
  return (
    <div className="w-full bg-white/95 backdrop-blur-sm border-b border-[#ADBBDA]/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#3D52A0] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📋</span>
          </div>
          <span className="ml-3 text-[#3D52A0] font-semibold text-lg">ExamMark</span>
        </div>

        {/* Right side - Notification, Name, Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative">
            <Bell className="w-6 h-6 text-[#7091E6] cursor-pointer hover:text-[#3D52A0] transition-colors" />
            <Badge className="absolute -top-1 -right-1 bg-[#3D52A0] text-white text-xs w-5 h-5 rounded-full p-0 flex items-center justify-center">
              2
            </Badge>
          </div>

          {/* Marker Name */}
          <span className="text-[#3D52A0] font-medium">Dr. John Smith</span>

          {/* Marker Avatar */}
          <div className="w-10 h-10 bg-[#8697C4] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}