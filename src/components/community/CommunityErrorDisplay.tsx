
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";

interface CommunityErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onResetError: () => void;
  retryCount: number;
}

export function CommunityErrorDisplay({ 
  error, 
  onRetry, 
  onResetError, 
  retryCount 
}: CommunityErrorDisplayProps) {
  const isNetworkError = error.toLowerCase().includes('fetch') || error.toLowerCase().includes('network');

  return (
    <Card>
      <CardContent className="p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {isNetworkError ? 'Connection Issue' : 'Loading Error'}
          </AlertTitle>
          <AlertDescription>
            {isNetworkError 
              ? 'Unable to connect to the server. Please check your internet connection.'
              : error
            }
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again {retryCount > 0 && `(Attempt ${retryCount + 1})`}
          </Button>
          
          {isNetworkError && (
            <Button variant="outline" onClick={onResetError} className="w-full">
              <Wifi className="h-4 w-4 mr-2" />
              Check Connection
            </Button>
          )}
        </div>

        {retryCount > 2 && (
          <p className="text-sm text-gray-600 mt-3 text-center">
            If the problem persists, please contact support or try again later.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
