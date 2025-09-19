import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';
import { Input } from '../ui/Attendent/input';
import { Label } from '../ui/Attendent/label';
import { Textarea } from '../ui/Attendent/textarea';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';

interface Student {
  id: string;
  nic: string;
  name: string;
  school: string;
  contactNumber: string;
  homeAddress: string;
  isPresent: boolean;
}

interface RegisterStudentProps {
  selectedSchool: string;
  onBack: () => void;
  onRegister: (student: Omit<Student, 'id' | 'isPresent'>) => void;
}

export function RegisterStudent({ selectedSchool, onBack, onRegister }: RegisterStudentProps) {
  const [formData, setFormData] = useState({
    nic: '',
    name: '',
    school: '',
    contactNumber: '',
    homeAddress: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateNIC = (nic: string) => {
    const cleanNIC = nic.trim().toUpperCase();
    
    // Old NIC format: 9 digits + V/X (e.g., 123456789V)
    if (/^\d{9}[VX]$/.test(cleanNIC)) {
      return cleanNIC.length === 10;
    }
    
    // New NIC format: 12 digits (e.g., 123456789012)
    if (/^\d{12}$/.test(cleanNIC)) {
      return cleanNIC.length === 12;
    }
    
    return false;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nic.trim()) {
      newErrors.nic = 'NIC is required';
    } else if (!validateNIC(formData.nic)) {
      newErrors.nic = 'Enter valid NIC (9 digits + V/X or 12 digits)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRegister({
      nic: formData.nic.trim().toUpperCase(),
      name: formData.name.trim(),
      school: selectedSchool,
      contactNumber: formData.contactNumber.trim(),
      homeAddress: formData.homeAddress.trim() || 'Not Provided'
    });
    
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="flex items-center gap-2">
                <UserPlus className="w-6 h-6" />
                Register New Student
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Adding student to {selectedSchool}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number *</Label>
                  <Input
                    id="nic"
                    type="text"
                    placeholder="Enter NIC number (e.g., 123456789V or 123456789012)"
                    value={formData.nic}
                    onChange={(e) => handleChange('nic', e.target.value.toUpperCase())}
                    className={errors.nic ? 'border-destructive' : ''}
                    maxLength={12}
                  />
                  {errors.nic && (
                    <p className="text-sm text-destructive">{errors.nic}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Old format: 9 digits + V/X (e.g., 123456789V) or New format: 12 digits
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter 10-digit contact number"
                    value={formData.contactNumber}
                    onChange={(e) => handleChange('contactNumber', e.target.value.replace(/\D/g, ''))}
                    className={errors.contactNumber ? 'border-destructive' : ''}
                    maxLength={10}
                  />
                  {errors.contactNumber && (
                    <p className="text-sm text-destructive">{errors.contactNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Home Address (Optional)</Label>
                  <Textarea
                    id="homeAddress"
                    placeholder="Enter home address (optional)"
                    value={formData.homeAddress}
                    onChange={(e) => handleChange('homeAddress', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Registering...' : 'Register Student'}
                  </Button>
                  <Button type="button" variant="outline" onClick={onBack} className="sm:w-auto">
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