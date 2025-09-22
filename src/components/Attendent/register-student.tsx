import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Attendent/card';
import { Button } from '../ui/Attendent/button';
import { Input } from '../ui/Attendent/input';
import { Label } from '../ui/Attendent/label';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { registerStudent } from '@/lib/api';
import { toast } from 'sonner';

interface RegisterStudentProps {
  selectedSchoolId: number;
  selectedSchoolName: string;
  onBack: () => void;
  onRegistrationSuccess: () => void;
}

export function RegisterStudent({ selectedSchoolId, selectedSchoolName, onBack, onRegistrationSuccess }: RegisterStudentProps) {
  const [formData, setFormData] = useState({
    name: '',
    NIC: '',
    contact_phone: '',
    contact_email: ''
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

    if (!formData.NIC.trim()) {
      newErrors.NIC = 'NIC is required';
    } else if (!validateNIC(formData.NIC)) {
      newErrors.NIC = 'Enter valid NIC (9 digits + V/X or 12 digits)';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contact_phone.trim())) {
      newErrors.contact_phone = 'Please enter a valid 10-digit contact number';
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email.trim())) {
      newErrors.contact_email = 'Please enter a valid email address';
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
        school_id: selectedSchoolId
      };

      await registerStudent(registrationData);
      toast.success(`🎉 ${formData.name.trim()} has been registered and marked as present!`);
      onRegistrationSuccess(); // Refresh attendance data
      onBack(); // Go back to search page
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('A student with this NIC already exists!');
        setErrors({ NIC: 'Student with this NIC already exists' });
      } else {
        toast.error('Failed to register student. Please try again.');
        console.error('Registration error:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
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
                Adding student to {selectedSchoolName}
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
                    value={formData.NIC}
                    onChange={(e) => handleChange('NIC', e.target.value.toUpperCase())}
                    className={errors.NIC ? 'border-destructive' : ''}
                    maxLength={12}
                  />
                  {errors.NIC && (
                    <p className="text-sm text-destructive">{errors.NIC}</p>
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
                  <Label htmlFor="contactPhone">Contact Number *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="Enter 10-digit contact number"
                    value={formData.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value.replace(/\D/g, ''))}
                    className={errors.contact_phone ? 'border-destructive' : ''}
                    maxLength={10}
                  />
                  {errors.contact_phone && (
                    <p className="text-sm text-destructive">{errors.contact_phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="Enter email address"
                    value={formData.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className={errors.contact_email ? 'border-destructive' : ''}
                  />
                  {errors.contact_email && (
                    <p className="text-sm text-destructive">{errors.contact_email}</p>
                  )}
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