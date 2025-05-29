interface LoggedError {
  id: string;
  timestamp: string;
  message: string;
  userId?: string;
  userEmail?: string;
  route: string;
  type: 'access_denied' | 'auth_error' | 'general_error';
  details?: string;
}

class ErrorLogger {
  private errors: LoggedError[] = [];
  private maxErrors = 100; // Keep last 100 errors

  log(error: {
    message: string;
    userId?: string;
    userEmail?: string;
    route: string;
    type: 'access_denied' | 'auth_error' | 'general_error';
    details?: string;
  }) {
    const loggedError: LoggedError = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...error
    };

    this.errors.unshift(loggedError);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    console.log('🚨 Error logged:', loggedError);
  }

  getErrors(): LoggedError[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    console.log('📝 Error log cleared');
  }
}

export const errorLogger = new ErrorLogger();
export type { LoggedError };
