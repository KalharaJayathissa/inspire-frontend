import React, { useState } from 'react';
import { AlertCircle, User, CreditCard, BookOpen, MapPin, Phone, School, CheckCircle, Mail } from 'lucide-react';
import { registerStudent, checkNicExists } from "@/lib/api";
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';


// Custom CSS for green radio buttons only
const customStyles = `
  /* Radio button styling */
  input[type="radio"]:checked {
    background-color: #2D620A !important;
    border-color: #2D620A !important;
  }
  
  input[type="radio"]:focus {
    box-shadow: 0 0 0 2px rgba(45, 98, 10, 0.2) !important;
    border-color: #2D620A !important;
  }
`;

// Inject styles into head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  if (!document.querySelector('[data-radio-green-styles]')) {
    styleElement.setAttribute('data-radio-green-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

interface FormData {
  fullName: string;
  nicNumber: string;
  email: string;
  shy: string;
  gender: string;
  subjectStream: string;
  school: string;
  address: string;
  mobileNumber: string;
  examLocation: string;
}

interface FormErrors {
  fullName?: string;
  nicNumber?: string;
  email?: string;
  shy?: string;
  gender?: string;
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
    email: '',
    shy: '',
    gender: '',
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
  const navigate = useNavigate();

  const schools = [
    'Kegalu Vidyalaya',
    'Kegalu Balika Vidyalaya',
    'St.Joesph’s Balika Vidyalaya',
    'St.Mary’s College',
    'Dudley Senanayake Central College, Tholangamuwa',
    'Pinnawala Central College',
    'Zahira College, Mawanella',
    'Swarna Jayanthi Maha Vidyalaya',
    'Ruwanwella Rajasinghe Central College'
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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Shy validation
    if (!formData.shy) {
      newErrors.shy = 'Attempt selection is required';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Gender selection is required';
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

    // Note: shy, gender, subjectStream, address, examLocation are optional
    // since they won't be stored in the current database structure

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to check if NIC exists in Supabase - Replace with actual Supabase query
  const checkNicExistsInDB = async (nic: string) => {
  if (!nic || nic.length !== 12) return;
  
  setIsCheckingNic(true);
  
  try {
    const result = await checkNicExists(nic);
    
    if (result.exists) {
      setNicWarning('⚠️ This NIC number already exists in our records');
      toast.error('This NIC number is already registered in our system');
    } else {
      setNicWarning('');
      toast.success('NIC number is available');
    }
  } catch (error) {
    console.error('Error checking NIC:', error);
    setNicWarning(''); // Clear warning on error
    toast.error('Error checking NIC number. Please try again.');
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
    checkNicExistsInDB(processedValue); // Use the new function
  } else if (name === 'nicNumber') {
    setNicWarning('');
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error('Please fill in all required fields correctly');
    return;
  }

  if (nicWarning) {
    toast.error('Please resolve the NIC number issue before submitting');
    return;
  }

  setIsSubmitting(true);

  try {
    console.log("Submitting form data:", formData); // Debug log
    
    const result = await registerStudent(formData);
    
    console.log("Registration successful:", result); // Debug log
    toast.success('🎉 Registration submitted successfully! Welcome to KESS Inspire 2025!', {
      duration: 2000,
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);


    
    // Reset form
    setFormData({
      fullName: '',
      nicNumber: '',
      email: '',
      shy: '',
      gender: '',
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
    console.error('Error response:', error.response); // Debug log
    
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast.error(`❌ ${errorMessage}`, {
      duration: 4000,
    });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-8 xl:mb-10  
            bg-gradient-to-r from-[#2D620A] via-[#3E7D10] to-[#5AA91C] 
            -m-4 sm:-m-6 lg:-m-8 p-6 sm:p-8 lg:p-10 
            rounded-t-xl sm:rounded-t-2xl">
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl sm:mt-1 lg:mt-2 xl:mt-4 font-bold text-white mb-2">
              Student Registration
            </h1>
            <p className="text-sm sm:text-base text-white/90">
              Please fill out all required information
            </p>
          </div>

          {/* Form Content - Properly separated from header */}
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                  errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your full name "
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                    errors.nicNumber || nicWarning 
                      ? 'border-red-500 bg-red-50 focus:border-red-500' 
                      : formData.nicNumber.length === 12 && !nicWarning
                        ? 'border-green-500 bg-green-50 focus:border-green-500'
                        : 'border-gray-300 hover:border-gray-400'
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

            {/* Email */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Attempt *
              </label>
              <select
                name="shy"
                value={formData.shy}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 text-sm sm:text-base bg-white ${
                  errors.shy ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="" disabled className="text-gray-500 bg-white hover:bg-[#c7f7a1] hover:text-[#2D620A]">Select Attempt</option>
                <option value="1st" className="text-gray-900 bg-white hover:bg-[#c7f7a1] hover:text-[#2D620A]">1st Shy</option>
                <option value="2nd" className="text-gray-900 bg-white hover:bg-[#c7f7a1] hover:text-[#2D620A]">2nd Shy</option>
                <option value="3rd" className="text-gray-900 bg-white hover:bg-[#c7f7a1] hover:text-[#2D620A]">3rd Shy</option>
              </select>
              
              {errors.shy && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.shy}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3">
                <User className="w-4 h-4 inline mr-2" />
                Gender *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1]  hover:border-[#2D620A] transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                    style={{ accentColor: '#2D620A' }}
                  />
                  <span className="text-gray-700 text-sm sm:text-base">Male</span>
                </label>
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1] hover:border-[#2D620A] transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                    style={{ accentColor: '#2D620A' }}
                  />
                  <span className="text-gray-700 text-sm sm:text-base">Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  {errors.gender}
                </p>
              )}
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
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1] hover:border-[#2D620A] transition-colors">
                    <input
                      type="radio"
                      name="subjectStream"
                      value="physical-science"
                      checked={formData.subjectStream === 'physical-science'}
                      onChange={handleInputChange}
                      className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                      style={{ accentColor: '#2D620A' }}
                    />
                    <span className="text-gray-700 text-sm sm:text-base">Physical Science (Maths)</span>
                  </label>
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1] hover:border-[#2D620A] transition-colors">
                    <input
                      type="radio"
                      name="subjectStream"
                      value="biological-science"
                      checked={formData.subjectStream === 'biological-science'}
                      onChange={handleInputChange}
                      className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                      style={{ accentColor: '#2D620A' }}
                    />
                    <span className="text-gray-700 text-sm sm:text-base">Biological Science (Bio)</span>
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 text-sm sm:text-base bg-white ${
                    errors.school ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                <option value="" disabled className="text-gray-500 bg-white">
                   Select your school 
                </option>
                  {schools.map((school, index) => (
                    <option key={index} value={school} className="text-gray-900 bg-white focus:text-green-200">
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
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors resize-none text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
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
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-[#2D620A] focus:border-[#2D620A] hover:border-[#2D620A] transition-colors text-gray-900 placeholder-gray-400 text-sm sm:text-base ${
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
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1] hover:border-[#2D620A] transition-colors">
                  <input
                    type="radio"
                    name="examLocation"
                    value="in-school"
                    checked={formData.examLocation === 'in-school'}
                    onChange={handleInputChange}
                    className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                    style={{ accentColor: '#2D620A' }}
                  />
                  <span className="text-gray-700 text-sm sm:text-base">In my school</span>
                </label>
                <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-[#c7f7a1] hover:border-[#2D620A] transition-colors">
                  <input
                    type="radio"
                    name="examLocation"
                    value="external-kegalle"
                    checked={formData.examLocation === 'external-kegalle'}
                    onChange={handleInputChange}
                    className="mr-3 text-[#2D620A] focus:ring-[#2D620A] focus:ring-offset-0 border-gray-300 w-4 h-4"
                    style={{ accentColor: '#2D620A' }}
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
                className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-white 
                transition-all duration-200 text-sm sm:text-base lg:text-lg ${
                  isSubmitting || nicWarning
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-[#2D620A] hover:bg-[#265209] focus:ring-2 focus:ring-[#2D620A] transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
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
    </div>
  );
};

export default StudentRegistrationForm;