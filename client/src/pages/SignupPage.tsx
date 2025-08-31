import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateName, validateDateOfBirth } from '../utils/validation';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: null as Date | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP verification states
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // OTP countdown timer
  useEffect(() => {
    if (showOTPSection && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showOTPSection, countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date
    }));
    // Clear error when date is selected
    if (errors.dateOfBirth) {
      setErrors(prev => ({
        ...prev,
        dateOfBirth: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!validateDateOfBirth(formData.dateOfBirth.toISOString().split('T')[0])) {
      newErrors.dateOfBirth = 'You must be at least 13 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // OTP handling functions
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(formData.email, otp);

      if (response.success && response.data?.token && response.data?.user) {
        toast.success('Account created successfully!');
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        toast.error(response.message || response.error || 'Invalid OTP');
        // Clear OTP field on error
        setOtp('');
        otpInputRef.current?.focus();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
      // Clear OTP field on error
      setOtp('');
      otpInputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const response = await authAPI.resendOTP(formData.email, 'email_verification');

      if (response.success) {
        toast.success('OTP sent successfully!');
        setCanResend(false);
        setCountdown(30);
        setOtp('');
        otpInputRef.current?.focus();
      } else {
        toast.error(response.message || response.error || 'Failed to resend OTP');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth!.toISOString().split('T')[0]
      });
      
      if (response.success) {
        toast.success('OTP sent to your email!');
        // Show OTP section instead of navigating
        setShowOTPSection(true);
        setCountdown(30);
        setCanResend(false);
        // Focus first OTP input
        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 100);
      } else {
        toast.error(response.message || response.error || 'Something went wrong');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      toast.error('Google authentication failed. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.googleAuth(credentialResponse.credential);
      
      if (response.success && response.data?.token && response.data?.user) {
        toast.success('Account created successfully with Google!');
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      } else {
        toast.error(response.message || response.error || 'Google authentication failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Google authentication failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate max date (13 years ago)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  // Calculate min date (100 years ago)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo at top-left on desktop, centered on mobile */}
      <div className="absolute top-8 lg:top-5 left-1/2 transform -translate-x-1/2 lg:left-14 lg:transform-none z-10">
        <div className="flex items-center">
          <img 
            src="/icon.svg" 
            alt="Highway Delite" 
            className="w-8 mr-3"
          />
          <span className="text-2xl font-bold text-gray-900">HD</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left side - Form */}
        <div className="flex-1 flex items-top lg:items-center justify-center p-8 mt-2 lg:mt-4 bg-white">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center lg:text-left mb-8 mt-12 lg:mt-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign Up</h1>
              <p className="text-gray-500">Sign up to enjoy the features of HD</p>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 z-10">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Jonas Kahnwald"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 z-10">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dateOfBirth}
                onChange={handleDateChange}
                dateFormat="dd MMMM yyyy"
                placeholderText="11 December 1997"
                maxDate={maxDate}
                minDate={minDate}
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
                wrapperClassName="w-full"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 z-10">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="jonas_kahnwald@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={showOTPSection}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } ${showOTPSection ? 'bg-gray-100' : ''}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* OTP Verification Section */}
            {showOTPSection && (
              <div className="space-y-4">
                {/* OTP Input Field */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 z-10">
                    OTP
                  </label>
                  <input
                    ref={otpInputRef}
                    type={showOTP ? "text" : "password"}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOTP(!showOTP)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOTP ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in {countdown} seconds
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            )}

            {/* Get OTP Button - Only show when OTP section is not visible */}
            {!showOTPSection && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Get OTP'
                )}
              </button>
            )}

            {/* Divider and Google OAuth - Only show when OTP section is not visible */}
            {!showOTPSection && (
              <>
                {/* Divider */}
                <div className="my-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                </div>

                {/* Google OAuth Button */}
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleAuth}
                    onError={() => {
                      toast.error('Google authentication failed. Please try again.');
                    }}
                    theme="outline"
                    size="large"
                    text="continue_with"
                    width="100%"
                    logo_alignment="center"
                  />
                </div>
              </>
            )}
          </form>

          {/* Already have account link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Container image */}
      <div className="hidden lg:block flex-1 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/container.svg" 
            alt="Container illustration" 
            className="w-full h-full object-contain"
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
