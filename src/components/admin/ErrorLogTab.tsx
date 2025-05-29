
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { errorLogger, LoggedError } from "@/utils/errorLogger";
import { RefreshCw, Trash2, Download } from "lucide-react";

export const ErrorLogTab = () => {
  const [errors, setErrors] = useState<LoggedError[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  const refreshErrors = () => {
    setErrors(errorLogger.getErrors());
  };

  const clearErrors = () => {
    errorLogger.clearErrors();
    setErrors([]);
  };

  useEffect(() => {
    refreshErrors();
    
    // Auto-refresh every 3 seconds to catch real-time errors
    const interval = setInterval(refreshErrors, 3000);
    return () => clearInterval(interval);
  }, []);

  const getErrorBadgeVariant = (type: string) => {
    switch (type) {
      case 'access_denied':
        return 'destructive';
      case 'auth_error':
        return 'secondary';
      case 'network_error':
        return 'outline';
      case 'console_error':
        return 'default';
      default:
        return 'outline';
    }
  };

  const filteredErrors = filterType === 'all' 
    ? errors 
    : errors.filter(error => error.type === filterType);

  const formatErrorLog = () => {
    return filteredErrors.map(error => 
      `[${error.timestamp}] ${error.type.toUpperCase()}: ${error.message}\n` +
      `  Route: ${error.route}\n` +
      `  User: ${error.userEmail || 'N/A'}\n` +
      `  Source: ${error.source || 'N/A'}\n` +
      (error.details ? `  Details: ${error.details}\n` : '') +
      (error.stack ? `  Stack: ${error.stack.split('\n')[0]}\n` : '') +
      '---'
    ).join('\n');
  };

  const downloadLog = () => {
    const logContent = formatErrorLog();
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-log-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const accessDeniedCount = errors.filter(e => e.type === 'access_denied').length;
  const authErrorCount = errors.filter(e => e.type === 'auth_error').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Error Log</CardTitle>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>Total: {errors.length}</span>
              <span className="text-red-600">Access Denied: {accessDeniedCount}</span>
              <span className="text-orange-600">Auth Errors: {authErrorCount}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Errors</SelectItem>
                <SelectItem value="access_denied">Access Denied</SelectItem>
                <SelectItem value="auth_error">Auth Errors</SelectItem>
                <SelectItem value="console_error">Console Errors</SelectItem>
                <SelectItem value="network_error">Network Errors</SelectItem>
                <SelectItem value="general_error">General Errors</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={refreshErrors}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={downloadLog}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="destructive" size="sm" onClick={clearErrors}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing {filteredErrors.length} of {errors.length} errors
            </p>
            <Textarea
              value={formatErrorLog()}
              readOnly
              placeholder="No errors logged yet. Try visiting routes as a non-authenticated user to test..."
              className="min-h-[300px] font-mono text-xs"
            />
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredErrors.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {filterType === 'all' ? 'No errors logged' : `No ${filterType.replace('_', ' ')} errors found`}
              </p>
            ) : (
              filteredErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant={getErrorBadgeVariant(error.type)}>
                        {error.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {error.source && (
                        <Badge variant="outline" className="text-xs">
                          {error.source}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{error.message}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Route: {error.route}</p>
                    {error.userEmail && <p>User: {error.userEmail}</p>}
                    {error.details && <p>Details: {error.details}</p>}
                    {error.stack && (
                      <p className="font-mono text-xs bg-gray-50 p-1 rounded">
                        Stack: {error.stack.split('\n')[0]}
                      </p>
                    )}
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
