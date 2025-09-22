import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Info } from "lucide-react";

export function InstructionsSection() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-[#ADBBDA]/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[#3D52A0]">
          <Info className="w-5 h-5" />
          Instructions for Markers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-[#3D52A0]/80">
          <div className="p-4 bg-[#EDF5F5] rounded-lg">
            <h4 className="font-semibold text-[#3D52A0] mb-2">General Guidelines</h4>
            <p className="mb-2">
              Please ensure you follow the marking scheme provided for each subject. 
              All papers must be graded within the allocated time frame.
            </p>
          </div>
          
          <div className="p-4 bg-[#ADBBDA]/20 rounded-lg">
            <h4 className="font-semibold text-[#3D52A0] mb-2">Quality Assurance</h4>
            <p className="mb-2">
              Double-check your marks before submitting. Any discrepancies should be 
              reported to the examination coordinator immediately.
            </p>
          </div>
          
          <div className="p-4 bg-[#8697C4]/20 rounded-lg">
            <h4 className="font-semibold text-[#3D52A0] mb-2">Technical Support</h4>
            <p>
              If you encounter any technical issues while using the system, 
              please contact the IT support team at extension 1234.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}