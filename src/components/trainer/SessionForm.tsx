
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useActiveSession } from '@/hooks/trainer/useActiveSession';
import StartSessionDialog from './StartSessionDialog';
import ActiveSessionForm from './ActiveSessionForm';

const SessionForm = () => {
  const { hasActiveSession, startSession, isStarting } = useActiveSession();

  if (hasActiveSession) {
    return <ActiveSessionForm />;
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Ready to Start Training?</CardTitle>
        <CardDescription>
          Begin a new climbing session and track your progress in real-time. 
          Your session will be saved automatically and persist even if you close the app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <StartSessionDialog onStartSession={startSession} isStarting={isStarting} />
      </CardContent>
    </Card>
  );
};

export default SessionForm;
