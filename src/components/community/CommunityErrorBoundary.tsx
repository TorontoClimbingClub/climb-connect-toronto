
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Users } from "lucide-react";
import { errorLogger } from "@/utils/errorLogger";

interface CommunityErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface CommunityErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

export class CommunityErrorBoundary extends React.Component<CommunityErrorBoundaryProps, CommunityErrorBoundaryState> {
  constructor(props: CommunityErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CommunityErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 CommunityErrorBoundary caught an error:', error, errorInfo);
    
    // Log to our error system
    errorLogger.log({
      message: `Community page error: ${error.message}`,
      route: '/community',
      type: 'general_error',
      details: `Error: ${error.message}, Stack: ${error.stack}, Component Stack: ${errorInfo.componentStack}`,
      source: 'community_error_boundary',
      stack: error.stack
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRetry = () => {
    console.log('🔄 Community error boundary retry requested');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
          <div className="max-w-2xl mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Community Temporarily Unavailable</h1>
                  <p className="text-gray-600">We're experiencing some technical difficulties with the community page.</p>
                </div>

                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error Details</AlertTitle>
                  <AlertDescription>
                    {this.state.error?.message || 'An unexpected error occurred while loading the community page.'}
                  </AlertDescription>
                </Alert>
                
                <div className="flex flex-col gap-3">
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                    className="w-full"
                  >
                    Return to Home
                  </Button>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-6 p-4 bg-gray-100 rounded-md">
                    <summary className="cursor-pointer font-semibold text-sm">Developer Information</summary>
                    <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap overflow-auto">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
