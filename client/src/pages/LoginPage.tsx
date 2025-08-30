import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { authAPI } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateForm = (): boolean => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
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
      const response = await authAPI.verifyLoginOTP({ email, otp });

      if (response.success && response.data?.token && response.data?.user) {
        toast.success('Logged in successfully!');
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
      const response = await authAPI.resendOTP(email, 'login');

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
      const response = await authAPI.requestOTP(email);
      
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
        toast.success('Logged in successfully with Google!');
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Logo at top-left on desktop, centered on mobile */}
      <div className="absolute top-8 lg:top-6 left-1/2 transform -translate-x-1/2 lg:left-16 lg:transform-none z-10">
        <div className="flex items-center">
          <img 
            src="/icon.svg" 
            alt="Highway Delite" 
            className="w-8 mr-2"
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
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In</h1>
              <p className="text-gray-500">Please login to continue to your account.</p>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 z-10">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jonas_kahnwald@gmail.com"
                value={email}
                onChange={handleEmailChange}
                disabled={showOTPSection}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  error ? 'border-red-500' : 'border-gray-300'
                } ${showOTPSection ? 'bg-gray-100' : ''}`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
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
                    'Sign In'
                  )}
                </button>
              </div>
            )}

            {/* Keep me logged in checkbox - Only show when OTP section is not visible */}
            {!showOTPSection && (
              <div className="flex items-center">
                <input
                  id="keep-logged-in"
                  name="keep-logged-in"
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="keep-logged-in" className="ml-2 block text-sm text-gray-900">
                  Keep me logged in
                </label>
              </div>
            )}

            {/* Sign In Button - Only show when OTP section is not visible */}
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
                  'Sign In'
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

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Need an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Container image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden right-3">
        <div className="absolute inset-0 flex items-end justify-center mt-2 mb-2">
          <img 
            src="/container.svg" 
            alt="Container illustration" 
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
