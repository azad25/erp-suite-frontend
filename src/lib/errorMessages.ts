// User-friendly error messages for common API errors
export const getErrorMessage = (error: string, field?: string): string => {
  // Common validation errors
  const errorMappings: Record<string, string> = {
    // Authentication errors
    'Invalid credentials': 'The email or password you entered is incorrect. Please try again.',
    'User email already exists': 'An account with this email already exists. Please use a different email or try signing in.',
    'Organization domain already exists': 'This domain is already registered. Please use a different domain or contact support.',
    'Account is deactivated': 'Your account has been deactivated. Please contact support for assistance.',
    
    // Validation errors
    'email is required': 'Please enter your email address.',
    'password is required': 'Please enter your password.',
    'first_name is required': 'Please enter your first name.',
    'last_name is required': 'Please enter your last name.',
    'organization_name is required': 'Please enter your organization name.',
    'domain is required': 'Please enter your organization domain.',
    
    // Password validation
    'password must be at least 8 characters': 'Your password must be at least 8 characters long.',
    'password must contain at least one uppercase letter, one lowercase letter, and one number': 'Your password must include at least one uppercase letter, one lowercase letter, and one number.',
    
    // Domain validation
    'domain must be a valid domain': 'Please enter a valid domain name (e.g., company.com).',
    'domain is not a valid fqdn': 'Please enter a valid domain name (e.g., company.com).',
    
    // Network errors
    'Network error occurred': 'Unable to connect to the server. Please check your internet connection and try again.',
    'Server error': 'We\'re experiencing technical difficulties. Please try again in a few moments.',
    'Internal server error': 'We\'re experiencing technical difficulties. Please try again in a few moments.',
    
    // Generic errors
    'An error occurred': 'Something went wrong. Please try again.',
    'Failed to create organization': 'Unable to create your organization. Please try again.',
    'Failed to create user': 'Unable to create your account. Please try again.',
    'Registration failed': 'Account creation failed. Please check your information and try again.',
    'Login failed': 'Sign in failed. Please check your credentials and try again.',
  };

  // Check for exact match first
  if (errorMappings[error]) {
    return errorMappings[error];
  }

  // Check for partial matches (case insensitive)
  const lowerError = error.toLowerCase();
  for (const [key, message] of Object.entries(errorMappings)) {
    if (lowerError.includes(key.toLowerCase())) {
      return message;
    }
  }

  // Field-specific error handling
  if (field) {
    if (error.includes('required')) {
      const fieldNames: Record<string, string> = {
        email: 'email address',
        password: 'password',
        first_name: 'first name',
        last_name: 'last name',
        organization_name: 'organization name',
        domain: 'domain',
        password_confirmation: 'password confirmation',
      };
      return `Please enter your ${fieldNames[field] || field}.`;
    }
    
    if (error.includes('invalid') || error.includes('format')) {
      const fieldNames: Record<string, string> = {
        email: 'Please enter a valid email address.',
        domain: 'Please enter a valid domain name (e.g., company.com).',
        password: 'Please enter a valid password.',
      };
      return fieldNames[field] || `Please enter a valid ${field}.`;
    }
  }

  // Return the original error if no mapping found, but make it more user-friendly
  return error.charAt(0).toUpperCase() + error.slice(1);
};

// Parse field errors and convert them to user-friendly messages
export const parseFieldErrors = (errors: Record<string, string[]>): Record<string, string[]> => {
  const parsedErrors: Record<string, string[]> = {};
  
  for (const [field, fieldErrors] of Object.entries(errors)) {
    parsedErrors[field] = fieldErrors.map(error => getErrorMessage(error, field));
  }
  
  return parsedErrors;
};

// Extract the main error message from various error formats
export const extractMainError = (error: any): string => {
  if (typeof error === 'string') {
    return getErrorMessage(error);
  }
  
  if (error?.message) {
    return getErrorMessage(error.message);
  }
  
  if (error?.error) {
    return getErrorMessage(error.error);
  }
  
  if (error?.detail) {
    return getErrorMessage(error.detail);
  }
  
  return 'An unexpected error occurred. Please try again.';
};