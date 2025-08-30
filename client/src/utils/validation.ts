export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateDateOfBirth = (date: string): boolean => {
  const selectedDate = new Date(date);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - selectedDate.getFullYear();
  
  // Must be at least 13 years old
  return age >= 13 && selectedDate < currentDate;
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getMinDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 100); // 100 years ago
  return formatDateForInput(date);
};

export const getMaxDate = (): string => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 13); // 13 years ago
  return formatDateForInput(date);
};
