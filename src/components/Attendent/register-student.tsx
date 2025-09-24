import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Attendent/card";
import { Button } from "../ui/Attendent/button";
import { Input } from "../ui/Attendent/input";
import { Label } from "../ui/Attendent/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, UserPlus, Save } from "lucide-react";
import { registerStudentFromInvigilator } from "@/lib/api";
import { toast } from "sonner";

interface RegisterStudentProps {
  selectedSchoolId: number;
  selectedSchoolName: string;
  onBack: () => void;
  onRegistrationSuccess: () => void;
}

export function RegisterStudent({
  selectedSchoolId,
  selectedSchoolName,
  onBack,
  onRegistrationSuccess,
}: RegisterStudentProps) {
  const [formData, setFormData] = useState({
    name: "",
    NIC: "",
    contact_phone: "",
    contact_email: "",
    shy: "",
    gender: "",
    subject_stream: "",
    exam_location: "in-school", // Default to "in my school"
    medium: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateNIC = (nic: string) => {
    const cleanNIC = nic.trim();

    // New NIC format: 12 digits only (e.g., 123456789012)
    if (/^\d{12}$/.test(cleanNIC)) {
      return cleanNIC.length === 12;
    }

    return false;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.NIC.trim()) {
      newErrors.NIC = "NIC is required";
    } else if (!validateNIC(formData.NIC)) {
      newErrors.NIC = "Enter valid NIC!";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact_phone.trim())) {
      newErrors.contact_phone = "Please enter a valid 10-digit contact number";
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email.trim())
    ) {
      newErrors.contact_email = "Please enter a valid email address";
    }

    if (!formData.shy.trim()) {
      newErrors.shy = "Attempt is required";
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.subject_stream.trim()) {
      newErrors.subject_stream = "Subject stream is required";
    }

    if (!formData.medium.trim()) {
      newErrors.medium = "Medium is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = {
        name: formData.name.trim(),
        NIC: formData.NIC.trim().toUpperCase(),
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        shy: formData.shy.trim(),
        gender: formData.gender.trim(),
        subject_stream: formData.subject_stream.trim(),
        exam_location: formData.exam_location.trim(),
        medium: formData.medium.trim(),
        school_id: selectedSchoolId,
      };

      await registerStudentFromInvigilator(registrationData);
      toast.success(
        `🎉 ${formData.name.trim()} has been registered and marked as present!`
      );
      onRegistrationSuccess(); // Refresh attendance data
      onBack(); // Go back to search page
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("A student with this NIC already exists!");
        setErrors({ NIC: "Student with this NIC already exists" });
      } else {
        toast.error("Failed to register student. Please try again.");
        console.error("Registration error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-2xl">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-start sm:gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-center sm:text-left">
              <h1 className="flex items-center justify-center sm:justify-start gap-2 text-lg sm:text-xl lg:text-2xl font-semibold">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                Register New Student
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Adding student to {selectedSchoolName}
              </p>
            </div>
          </div>

          <Card className="mx-2 sm:mx-0">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nic" className="text-sm font-medium">
                    NIC Number *
                  </Label>
                  <Input
                    id="nic"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 12-digit NIC number (e.g.: 123456789012)"
                    value={formData.NIC}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits for new format
                      const filteredValue = value.replace(/[^0-9]/g, "");
                      handleChange("NIC", filteredValue);
                    }}
                    className={`h-11 sm:h-10 ${
                      errors.NIC ? "border-destructive" : ""
                    }`}
                    maxLength={12}
                  />
                  {errors.NIC && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.NIC}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground leading-tight">
                    Enter 12-digit NIC number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`h-11 sm:h-10 ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone" className="text-sm font-medium">
                    Contact Number *
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="07XXXXXXXX"
                    value={formData.contact_phone}
                    onChange={(e) =>
                      handleChange(
                        "contact_phone",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    className={`h-11 sm:h-10 ${
                      errors.contact_phone ? "border-destructive" : ""
                    }`}
                    maxLength={10}
                  />
                  {errors.contact_phone && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.contact_phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.contact_email}
                    onChange={(e) =>
                      handleChange("contact_email", e.target.value)
                    }
                    className={`h-11 sm:h-10 ${
                      errors.contact_email ? "border-destructive" : ""
                    }`}
                  />
                  {errors.contact_email && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.contact_email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shy" className="text-sm font-medium">
                      Attempt *
                    </Label>
                    <Select
                      value={formData.shy}
                      onValueChange={(value) => handleChange("shy", value)}
                    >
                      <SelectTrigger
                        className={`h-11 sm:h-10 ${
                          errors.shy ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select attempt" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st shy</SelectItem>
                        <SelectItem value="2nd">2nd shy</SelectItem>
                        <SelectItem value="3rd">3rd shy</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.shy && (
                      <p className="text-xs sm:text-sm text-destructive">
                        {errors.shy}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender *</Label>
                    <div className="flex gap-3">
                      <label
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.gender === "male"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">Male</span>
                      </label>
                      <label
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.gender === "female"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">Female</span>
                      </label>
                    </div>
                    {errors.gender && (
                      <p className="text-xs sm:text-sm text-destructive">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Subject Stream *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.subject_stream === "physical-science"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="subject_stream"
                        value="physical-science"
                        checked={formData.subject_stream === "physical-science"}
                        onChange={(e) =>
                          handleChange("subject_stream", e.target.value)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-center">
                        Physical Science
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.subject_stream === "biological-stream"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="subject_stream"
                        value="biological-stream"
                        checked={
                          formData.subject_stream === "biological-stream"
                        }
                        onChange={(e) =>
                          handleChange("subject_stream", e.target.value)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-center">
                        Biological Stream
                      </span>
                    </label>
                  </div>
                  {errors.subject_stream && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.subject_stream}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medium" className="text-sm font-medium">
                    Medium *
                  </Label>
                  <Select
                    value={formData.medium}
                    onValueChange={(value) => handleChange("medium", value)}
                  >
                    <SelectTrigger
                      className={`h-11 sm:h-10 ${
                        errors.medium ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sinhala">Sinhala</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.medium && (
                    <p className="text-xs sm:text-sm text-destructive">
                      {errors.medium}
                    </p>
                  )}
                </div>

                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 h-11 sm:h-10"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Registering..." : "Register Student"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="w-full sm:w-auto h-11 sm:h-10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
