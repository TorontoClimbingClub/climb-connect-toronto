
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveSession } from '@/hooks/trainer/useActiveSession';
import StartSessionDialog from './StartSessionDialog';
import ActiveSessionForm from './ActiveSessionForm';

const SessionForm = () => {
  const { hasActiveSession, startSession, isStarting, isLoadingSession } = useActiveSession();

  // Show loading state while checking for active session
  if (isLoadingSession) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  // Show active session form if there's an active session
  if (hasActiveSession) {
    return <ActiveSessionForm />;
  }

  // Show start session dialog if no active session
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>New Training Session</CardTitle>
        <CardDescription>
          Start a climbing session that will track your progress in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <StartSessionDialog onStartSession={startSession} isStarting={isStarting} />
      </CardContent>
    </Card>
  );
};

export default SessionForm;
