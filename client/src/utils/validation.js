export const validateAuthForm = (formData, isUserFresh) => {
  const errors = {};
  
  // Mobile validation
  if (!formData.mobile) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
    errors.mobile = 'Enter a valid 10-digit mobile number';
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  // Fresh user validations
  if (isUserFresh) {
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return errors;
};