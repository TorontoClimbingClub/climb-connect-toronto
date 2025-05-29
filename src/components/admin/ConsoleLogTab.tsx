
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Trash2, Download, Pause, Play } from "lucide-react";

interface ConsoleLog {
  id: string;
  timestamp: string;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  args: any[];
}

export const ConsoleLogTab = () => {
  const [logs, setLogs] = useState<ConsoleLog[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [isCapturing, setIsCapturing] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const maxLogs = 500;

  // Store original console methods
  const originalConsole = useRef({
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  });

  const addLog = (level: ConsoleLog['level'], args: any[]) => {
    if (!isCapturing) return;

    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    const newLog: ConsoleLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      args
    };

    setLogs(prev => {
      const updated = [newLog, ...prev];
      return updated.slice(0, maxLogs);
    });
  };

  useEffect(() => {
    // Override console methods
    console.log = (...args) => {
      originalConsole.current.log(...args);
      addLog('log', args);
    };

    console.info = (...args) => {
      originalConsole.current.info(...args);
      addLog('info', args);
    };

    console.warn = (...args) => {
      originalConsole.current.warn(...args);
      addLog('warn', args);
    };

    console.error = (...args) => {
      originalConsole.current.error(...args);
      addLog('error', args);
    };

    console.debug = (...args) => {
      originalConsole.current.debug(...args);
      addLog('debug', args);
    };

    return () => {
      // Restore original console methods
      console.log = originalConsole.current.log;
      console.info = originalConsole.current.info;
      console.warn = originalConsole.current.warn;
      console.error = originalConsole.current.error;
      console.debug = originalConsole.current.debug;
    };
  }, [isCapturing]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  const getBadgeVariant = (level: string) => {
    switch (level) {
      case 'error':
        return 'destructive';
      case 'warn':
        return 'secondary';
      case 'info':
        return 'default';
      case 'debug':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const filteredLogs = filterLevel === 'all' 
    ? logs 
    : logs.filter(log => log.level === filterLevel);

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const logContent = filteredLogs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleCapture = () => {
    setIsCapturing(!isCapturing);
  };

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warnCount = logs.filter(l => l.level === 'warn').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Console Logs</CardTitle>
            <div className="flex gap-4 mt-2 text-sm text-gray-600">
              <span>Total: {logs.length}</span>
              <span className="text-red-600">Errors: {errorCount}</span>
              <span className="text-orange-600">Warnings: {warnCount}</span>
              <span className={isCapturing ? "text-green-600" : "text-gray-400"}>
                {isCapturing ? "Capturing" : "Paused"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Logs</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="warn">Warnings</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="log">Log</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleCapture}
              className={isCapturing ? "text-orange-600" : "text-green-600"}
            >
              {isCapturing ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isCapturing ? "Pause" : "Resume"}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadLogs}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="destructive" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                checked={autoScroll} 
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded"
              />
              Auto-scroll to latest
            </label>
            <span className="text-sm text-gray-500">
              Showing {filteredLogs.length} of {logs.length} logs
            </span>
          </div>
          
          <div 
            ref={scrollRef}
            className="space-y-1 max-h-[500px] overflow-y-auto bg-gray-900 text-green-400 font-mono text-xs p-4 rounded-lg"
          >
            {filteredLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {filterLevel === 'all' ? 'No console logs yet...' : `No ${filterLevel} logs found`}
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 py-1 border-b border-gray-800">
                  <Badge variant={getBadgeVariant(log.level)} className="text-xs shrink-0">
                    {log.level.toUpperCase()}
                  </Badge>
                  <span className="text-gray-400 text-xs shrink-0 w-20">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-green-400 break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
