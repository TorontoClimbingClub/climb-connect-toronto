
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { errorLogger, LoggedError } from "@/utils/errorLogger";
import { RefreshCw, Trash2 } from "lucide-react";

export const ErrorLogTab = () => {
  const [errors, setErrors] = useState<LoggedError[]>([]);

  const refreshErrors = () => {
    setErrors(errorLogger.getErrors());
  };

  const clearErrors = () => {
    errorLogger.clearErrors();
    setErrors([]);
  };

  useEffect(() => {
    refreshErrors();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(refreshErrors, 5000);
    return () => clearInterval(interval);
  }, []);

  const getErrorBadgeVariant = (type: string) => {
    switch (type) {
      case 'access_denied':
        return 'destructive';
      case 'auth_error':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatErrorLog = () => {
    return errors.map(error => 
      `[${error.timestamp}] ${error.type.toUpperCase()}: ${error.message} (Route: ${error.route}, User: ${error.userEmail || 'N/A'})`
    ).join('\n');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Error Log</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshErrors}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={clearErrors}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Total errors logged: {errors.length}
            </p>
            <Textarea
              value={formatErrorLog()}
              readOnly
              placeholder="No errors logged yet..."
              className="min-h-[300px] font-mono text-xs"
            />
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {errors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No errors logged</p>
            ) : (
              errors.map((error) => (
                <div key={error.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getErrorBadgeVariant(error.type)}>
                      {error.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{error.message}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Route: {error.route}</p>
                    {error.userEmail && <p>User: {error.userEmail}</p>}
                    {error.details && <p>Details: {error.details}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
