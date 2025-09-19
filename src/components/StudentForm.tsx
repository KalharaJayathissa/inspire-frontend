import React, { useState } from 'react';
import { AlertCircle, User, CreditCard, BookOpen, MapPin, Phone, School, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  nicNumber: string;
  subjectStream: string;
  school: string;
  address: string;
  mobileNumber: string;
  examLocation: string;
}

interface FormErrors {
  fullName?: string;
  nicNumber?: string;
  subjectStream?: string;
  school?: string;
  address?: string;
  mobileNumber?: string;
  examLocation?: string;
}

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    nicNumber: '',
    subjectStream: '',
    school: '',
    address: '',
    mobileNumber: '',
    examLocation: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [nicWarning, setNicWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingNic, setIsCheckingNic] = useState(false);

  // Simulate existing NIC numbers in database - Replace this with Supabase query later
  const existingNics = ['123456789012', '987654321098', '456789123456'];

  const schools = [
    'Select School',
    'Kegalle Vidyalaya',
    'Kegalle Balika Vidyalaya',
    'St. Joseph\'s College, Kegalle',
    'Kegalle Maha Vidyalaya',
    'Ruwanwella Central College',
    'Pinnawala Central College',
    'Royal College Colombo',
    'Trinity College Kandy',
    'Ananda College',
    'Nalanda College'
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    // NIC validation
    if (!formData.nicNumber) {
      newErrors.nicNumber = 'NIC number is required';
    } else if (!/^\d{12}$/.test(formData.nicNumber)) {
      newErrors.nicNumber = 'NIC number must be exactly 12 digits';
    }

    // Subject stream validation
    if (!formData.subjectStream) {
      newErrors.subjectStream = 'Subject stream is required';
    }

    // School validation
    if (!formData.school || formData.school === 'Select School') {
      newErrors.school = 'School selection is required';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Mobile number validation
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be exactly 10 digits';
    }

    // Exam location validation
    if (!formData.examLocation) {
      newErrors.examLocation = 'Exam location preference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to check if NIC exists in Supabase - Replace with actual Supabase query
  const checkNicExists = async (nic) => {
    if (!nic || nic.length !== 12) return;
    
    setIsCheckingNic(true);
    
    try {
      // Simulate API delay - Replace this with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('students')
      //   .select('nic_number')
      //   .eq('nic_number', nic)
      //   .single();
      
      const exists = existingNics.includes(nic);
      
      if (exists) {
        setNicWarning('⚠️ This NIC number already exists in our records');
      } else {
        setNicWarning('');
      }
    } catch (error) {
      console.error('Error checking NIC:', error);
    } finally {
      setIsCheckingNic(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Process specific field types
    if (name === 'nicNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (name === 'mobileNumber') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check NIC for duplicates when 12 digits are entered
    if (name === 'nicNumber' && processedValue.length === 12) {
      checkNicExists(processedValue);
    } else if (name === 'nicNumber') {
      setNicWarning('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (nicWarning) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual Supabase insertion
      // const { data, error } = await supabase
      //   .from('students')
      //   .insert([formData]);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Registration submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        nicNumber: '',
        subjectStream: '',
        school: '',
        address: '',
        mobileNumber: '',
        examLocation: ''
      });
      setNicWarning('');
      setErrors({});
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            {/* <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div> */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Student Registration
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Please fill out all required information
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your full name as per NIC"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* NIC Number */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                NIC Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="nicNumber"
                  value={formData.nicNumber}
                  onChange={handleInputChange}
                  maxLength={12}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                    errors.nicNumber || nicWarning 
                      ? 'border-red-500 bg-red-50 focus:border-red-500' 
                      : formData.nicNumber.length === 12 && !nicWarning
                        ? 'border-green-500 bg-green-50 focus:border-green-500'
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                  }`}
                  placeholder="Enter 12-digit NIC number"
                />
                {isCheckingNic && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-indigo-500 border-t-transparent"></div>
                  </div>
                )}
                {formData.nicNumber.length === 12 && !nicWarning && !isCheckingNic && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.nicNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.nicNumber}
                </p>
              )}
              {nicWarning && (
                <p className="mt-1 text-xs sm:text-sm text-amber-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {nicWarning}
                </p>
              )}
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Enter your 12-digit National Identity Card number
              </p>
            </div>

            {/* Two Column Layout for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Subject Stream */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Subject Stream *
                </label>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <input
                      type="radio"
                      name="subjectStream"
                      value="physical-science"
                      checked={formData.subjectStream === 'physical-science'}
                      onChange={handleInputChange}
                      className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm sm:text-base">Physical Science</span>
                  </label>
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                    <input
                      type="radio"
                      name="subjectStream"
                      value="biological-science"
                      checked={formData.subjectStream === 'biological-science'}
                      onChange={handleInputChange}
                      className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className="text-gray-700 text-sm sm:text-base">Biological Science</span>
                  </label>
                </div>
                {errors.subjectStream && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    {errors.subjectStream}
                  </p>
                )}
              </div>

              {/* School */}
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  <School className="w-4 h-4 inline mr-2" />
                  School *
                </label>
                <select
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:border-indigo-500 transition-colors text-gray-900 text-sm sm:text-base ${
                    errors.school ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {schools.map((school, index) => (
                    <option key={index} value={school} disabled={index === 0} className="text-gray-900">
                      {school}
                    </option>
                  ))}
                </select>
                {errors.school && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                    {errors.school}
                  </p>
                )}
              </div>

            </div>

            {/* Address */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Home Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:border-indigo-500 transition-colors resize-none text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your complete home address"
              />
              {errors.address && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                    errors.mobileNumber 
                      ? 'border-red-500 bg-red-50 focus:border-red-500' 
                      : formData.mobileNumber.length === 10
                        ? 'border-green-500 bg-green-50 focus:border-green-500'
                        : 'border-gray-300 hover:border-gray-400 focus:border-indigo-500'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                />
                {formData.mobileNumber.length === 10 && !errors.mobileNumber && (
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.mobileNumber}
                </p>
              )}
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Enter your 10-digit mobile number (e.g., 0771234567)
              </p>
            </div>

            {/* Exam Location */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">
                Where do you prefer to write exam? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                  <input
                    type="radio"
                    name="examLocation"
                    value="in-school"
                    checked={formData.examLocation === 'in-school'}
                    onChange={handleInputChange}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">In my school</span>
                </label>
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                  <input
                    type="radio"
                    name="examLocation"
                    value="external-kegalle"
                    checked={formData.examLocation === 'external-kegalle'}
                    onChange={handleInputChange}
                    className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-gray-700 text-sm sm:text-base">External location in Kegalle</span>
                </label>
              </div>
              {errors.examLocation && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.examLocation}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 sm:pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !!nicWarning}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 text-sm sm:text-base lg:text-lg ${
                  isSubmitting || nicWarning
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting Registration...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;