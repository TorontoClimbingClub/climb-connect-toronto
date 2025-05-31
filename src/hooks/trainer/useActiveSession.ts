
import { useLocalSession } from './useLocalSession';
import { useDbSession } from './useDbSession';
import { useStartSession } from './useStartSession';
import { useEndSession } from './useEndSession';

export function useActiveSession() {
  const { localSession, setLocalSession, updateLocalSession } = useLocalSession();
  const { activeDbSession, isLoadingSession } = useDbSession();
  
  const startSessionMutation = useStartSession(setLocalSession);
  const endSessionMutation = useEndSession(activeDbSession, localSession, setLocalSession);

  // Determine if there's an active session - both DB session and local session must exist
  const hasActiveSession = !!(activeDbSession && localSession && !isLoadingSession);

  return {
    activeSession: localSession,
    hasActiveSession,
    startSession: startSessionMutation.mutate,
    endSession: endSessionMutation.mutate,
    updateLocalSession,
    isStarting: startSessionMutation.isPending,
    isEnding: endSessionMutation.isPending,
    isLoadingSession
  };
}
