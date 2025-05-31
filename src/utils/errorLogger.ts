
interface LoggedError {
  id: string;
  timestamp: string;
  message: string;
  userId?: string;
  userEmail?: string;
  route: string;
  type: 'access_denied' | 'auth_error' | 'general_error' | 'console_error' | 'network_error';
  details?: string;
  stack?: string;
  source?: string;
}

class ErrorLogger {
  private errors: LoggedError[] = [];
  private maxErrors = 200; // Increased to keep more errors
  private originalConsoleError: typeof console.error;
  private originalConsoleWarn: typeof console.warn;

  constructor() {
    // Capture console.error and console.warn
    this.originalConsoleError = console.error;
    this.originalConsoleWarn = console.warn;
    
    console.error = (...args) => {
      this.logConsoleError('error', args);
      this.originalConsoleError.apply(console, args);
    };
    
    console.warn = (...args) => {
      this.logConsoleError('warn', args);
      this.originalConsoleWarn.apply(console, args);
    };
  }

  private logConsoleError(level: 'error' | 'warn', args: any[]) {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    // Only log if it contains keywords we care about
    const shouldLog = message.toLowerCase().includes('access') || 
                     message.toLowerCase().includes('denied') ||
                     message.toLowerCase().includes('auth') ||
                     message.toLowerCase().includes('error') ||
                     message.toLowerCase().includes('failed');
    
    if (shouldLog) {
      this.log({
        message: `[${level.toUpperCase()}] ${message}`,
        route: window.location.pathname,
        type: message.toLowerCase().includes('access') ? 'access_denied' : 
              message.toLowerCase().includes('auth') ? 'auth_error' : 'console_error',
        source: 'console',
        stack: new Error().stack
      });
    }
  }

  log(error: {
    message: string;
    userId?: string;
    userEmail?: string;
    route: string;
    type: 'access_denied' | 'auth_error' | 'general_error' | 'console_error' | 'network_error';
    details?: string;
    stack?: string;
    source?: string;
  }) {
    const loggedError: LoggedError = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
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

  // Method to manually log access denied errors
  logAccessDenied(route: string, userId?: string, userEmail?: string, details?: string) {
    this.log({
      message: 'Access denied to route',
      userId,
      userEmail,
      route,
      type: 'access_denied',
      details,
      source: 'access_control'
    });
  }
}

export const errorLogger = new ErrorLogger();
export type { LoggedError };
