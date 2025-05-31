
interface LoggedError {
  id: string;
  timestamp: string;
  message: string;
  userId?: string;
  userEmail?: string;
  route: string;
  type: 'access_denied' | 'auth_error' | 'general_error' | 'console_error' | 'network_error' | 'community_error' | 'performance_warning';
  details?: string;
  stack?: string;
  source?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLogger {
  private errors: LoggedError[] = [];
  private maxErrors = 200; // Increased to track more errors
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
    
    // Enhanced filtering for community-specific errors
    const shouldLog = message.toLowerCase().includes('access') || 
                     message.toLowerCase().includes('denied') ||
                     message.toLowerCase().includes('auth') ||
                     message.toLowerCase().includes('error') ||
                     message.toLowerCase().includes('failed') ||
                     message.toLowerCase().includes('community') ||
                     message.toLowerCase().includes('member');
    
    if (shouldLog) {
      const errorType = this.determineErrorType(message);
      const severity = this.determineSeverity(message, level);
      
      this.log({
        message: `[${level.toUpperCase()}] ${message}`,
        route: window.location.pathname,
        type: errorType,
        source: 'console',
        stack: new Error().stack,
        severity
      });
    }
  }

  private determineErrorType(message: string): LoggedError['type'] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('community') || lowerMessage.includes('member')) {
      return 'community_error';
    }
    if (lowerMessage.includes('access') || lowerMessage.includes('denied')) {
      return 'access_denied';
    }
    if (lowerMessage.includes('auth')) {
      return 'auth_error';
    }
    if (lowerMessage.includes('fetch') || lowerMessage.includes('network')) {
      return 'network_error';
    }
    return 'console_error';
  }

  private determineSeverity(message: string, level: string): LoggedError['severity'] {
    const lowerMessage = message.toLowerCase();
    
    if (level === 'error' || lowerMessage.includes('critical') || lowerMessage.includes('fatal')) {
      return 'critical';
    }
    if (lowerMessage.includes('community') && lowerMessage.includes('failed')) {
      return 'high';
    }
    if (level === 'warn' || lowerMessage.includes('warning')) {
      return 'medium';
    }
    return 'low';
  }

  log(error: {
    message: string;
    userId?: string;
    userEmail?: string;
    route: string;
    type: LoggedError['type'];
    details?: string;
    stack?: string;
    source?: string;
    severity?: LoggedError['severity'];
  }) {
    const loggedError: LoggedError = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      severity: 'medium',
      ...error
    };

    this.errors.unshift(loggedError);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Enhanced logging with severity
    const emoji = this.getSeverityEmoji(loggedError.severity);
    console.log(`${emoji} Error logged [${loggedError.severity?.toUpperCase()}]:`, loggedError);
  }

  private getSeverityEmoji(severity?: string): string {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔸';
      case 'low': return 'ℹ️';
      default: return '📝';
    }
  }

  getErrors(): LoggedError[] {
    return [...this.errors];
  }

  // Get errors by type
  getErrorsByType(type: LoggedError['type']): LoggedError[] {
    return this.errors.filter(error => error.type === type);
  }

  // Get community-specific errors
  getCommunityErrors(): LoggedError[] {
    return this.errors.filter(error => 
      error.type === 'community_error' || 
      error.route === '/community' ||
      error.source?.includes('community')
    );
  }

  // Get error statistics
  getErrorStats() {
    const total = this.errors.length;
    const byType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = this.errors.reduce((acc, error) => {
      const severity = error.severity || 'medium';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byType, bySeverity };
  }

  clearErrors() {
    this.errors = [];
    console.log('📝 Error log cleared');
  }

  // Method to manually log community-specific errors
  logCommunityError(message: string, details?: string, severity: LoggedError['severity'] = 'medium') {
    this.log({
      message: `Community: ${message}`,
      route: '/community',
      type: 'community_error',
      details,
      source: 'community_manual',
      severity
    });
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
      source: 'access_control',
      severity: 'high'
    });
  }

  // Method to log performance warnings
  logPerformanceWarning(operation: string, duration: number, threshold: number) {
    this.log({
      message: `Performance warning: ${operation} took ${duration}ms (threshold: ${threshold}ms)`,
      route: window.location.pathname,
      type: 'performance_warning',
      details: JSON.stringify({ operation, duration, threshold }),
      source: 'performance_monitor',
      severity: duration > threshold * 2 ? 'high' : 'medium'
    });
  }
}

export const errorLogger = new ErrorLogger();
export type { LoggedError };
