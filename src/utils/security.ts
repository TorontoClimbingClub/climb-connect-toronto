import DOMPurify from 'dompurify';

// HTML sanitization for user content
export const sanitizeHtml = (input: string): string => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input']
  });
};

// Input validation utilities
export const validateInput = {
  // Validate names (no special characters except spaces, hyphens, apostrophes)
  name: (input: string): boolean => {
    const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
    return nameRegex.test(input.trim());
  },

  // Validate phone numbers
  phone: (input: string): boolean => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(input.trim());
  },

  // Validate comment length and content
  comment: (input: string): boolean => {
    return input.trim().length >= 3 && input.trim().length <= 1000;
  },

  // Validate bio content
  bio: (input: string): boolean => {
    return input.trim().length <= 500;
  },

  // Password strength validation
  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Rate limiting utility for client-side
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  getRemainingTime(key: string, windowMs: number = 60000): number {
    const userAttempts = this.attempts.get(key) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const timeRemaining = windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeRemaining);
  }
}

// Escape special characters for safe display
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Generic error messages for users (hide implementation details)
export const getGenericErrorMessage = (error: any): string => {
  // Log the actual error for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Detailed error:', error);
  }

  // Return generic messages to users
  if (error?.message?.includes('email')) {
    return 'Please check your email address and try again.';
  }
  if (error?.message?.includes('password')) {
    return 'Please check your password and try again.';
  }
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'Something went wrong. Please try again later.';
};
