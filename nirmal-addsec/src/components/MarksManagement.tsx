import React, { useState } from "react";
import { InfoBar } from "./InfoBar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Edit2, Search, Plus, Check, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Mark {
  id: number;
  nic: string;
  marks: number;
}

export function MarksManagement() {
  const [marks, setMarks] = useState<Mark[]>([
    { id: 1, nic: "199512345678V", marks: 85 },
    { id: 2, nic: "200023456789V", marks: 92 },
    { id: 3, nic: "199734567890V", marks: 78 },
  ]);
  
  const [newNic, setNewNic] = useState("");
  const [newMarks, setNewMarks] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNic, setEditNic] = useState("");
  const [editMarks, setEditMarks] = useState("");

  const filteredMarks = marks.filter(mark =>
    mark.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMark = () => {
    if (!newNic.trim() || !newMarks.trim()) {
      toast.error("Please fill in both NIC number and marks");
      return;
    }

    const marksValue = parseFloat(newMarks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      toast.error("Please enter a valid mark between 0 and 100");
      return;
    }

    // Check if NIC already exists
    if (marks.some(mark => mark.nic === newNic.trim())) {
      toast.error("This NIC number already exists");
      return;
    }

    const newMark: Mark = {
      id: Date.now(),
      nic: newNic.trim(),
      marks: marksValue
    };

    setMarks([...marks, newMark]);
    setNewNic("");
    setNewMarks("");
    toast.success("Mark added successfully");
  };

  const handleEditStart = (mark: Mark) => {
    setEditingId(mark.id);
    setEditNic(mark.nic);
    setEditMarks(mark.marks.toString());
  };

  const handleEditSave = (id: number) => {
    if (!editNic.trim() || !editMarks.trim()) {
      toast.error("Please fill in both NIC number and marks");
      return;
    }

    const marksValue = parseFloat(editMarks);
    if (isNaN(marksValue) || marksValue < 0 || marksValue > 100) {
      toast.error("Please enter a valid mark between 0 and 100");
      return;
    }

    // Check if NIC already exists for other records
    if (marks.some(mark => mark.nic === editNic.trim() && mark.id !== id)) {
      toast.error("This NIC number already exists");
      return;
    }

    setMarks(marks.map(mark =>
      mark.id === id
        ? { ...mark, nic: editNic.trim(), marks: marksValue }
        : mark
    ));

    setEditingId(null);
    toast.success("Mark updated successfully");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditNic("");
    setEditMarks("");
  };

  return (
    <div className="min-h-screen relative">
      {/* Blurred Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat blur-sm scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTgzNDAwNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#7091E6]/20 via-[#8697C4]/30 to-[#ADBBDA]/20" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Info Bar */}
        <InfoBar />
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Section Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[#3D52A0]">Combined Mathematics</h1>
          </div>

          {/* Add Mark Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-[#ADBBDA]/50 shadow-lg mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-[#3D52A0] mb-4">Add Mark Section</h2>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[#3D52A0] font-medium mb-2">NIC Number</label>
                  <Input
                    value={newNic}
                    onChange={(e) => setNewNic(e.target.value)}
                    placeholder="Enter NIC number"
                    className="border-[#ADBBDA]/50 focus:border-[#7091E6]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[#3D52A0] font-medium mb-2">Marks</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newMarks}
                    onChange={(e) => setNewMarks(e.target.value)}
                    placeholder="Enter marks (0-100)"
                    className="border-[#ADBBDA]/50 focus:border-[#7091E6]"
                  />
                </div>
                <Button
                  onClick={handleAddMark}
                  className="bg-[#3D52A0] hover:bg-[#7091E6] text-white px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Mark
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* View & Edit Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-[#ADBBDA]/50 shadow-lg">
            <CardContent className="p-6">
              {/* Header with title and search */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold text-[#3D52A0]">View & Edit Mark Section</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[#3D52A0] font-medium">NIC:</span>
                  <div className="relative">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by NIC"
                      className="border-[#ADBBDA]/50 focus:border-[#7091E6] pr-10"
                    />
                    <Search className="w-4 h-4 text-[#7091E6] absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="rounded-lg border border-[#ADBBDA]/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#EDF5F5]">
                      <TableHead className="text-[#3D52A0] font-semibold">NIC Number</TableHead>
                      <TableHead className="text-[#3D52A0] font-semibold">Marks</TableHead>
                      <TableHead className="text-[#3D52A0] font-semibold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMarks.map((mark) => (
                      <TableRow key={mark.id} className="hover:bg-[#EDF5F5]/50">
                        <TableCell>
                          {editingId === mark.id ? (
                            <Input
                              value={editNic}
                              onChange={(e) => setEditNic(e.target.value)}
                              className="border-[#ADBBDA]/50 focus:border-[#7091E6]"
                            />
                          ) : (
                            <span className="text-[#3D52A0]">{mark.nic}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === mark.id ? (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editMarks}
                              onChange={(e) => setEditMarks(e.target.value)}
                              className="border-[#ADBBDA]/50 focus:border-[#7091E6] w-24"
                            />
                          ) : (
                            <span className="text-[#3D52A0] font-medium">{mark.marks}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === mark.id ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEditSave(mark.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleEditCancel}
                                className="border-[#ADBBDA] text-[#3D52A0] hover:bg-[#EDF5F5]"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleEditStart(mark)}
                              className="bg-[#7091E6] hover:bg-[#3D52A0] text-white"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredMarks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-[#8697C4] py-8">
                          {searchTerm ? "No marks found matching your search" : "No marks added yet"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}