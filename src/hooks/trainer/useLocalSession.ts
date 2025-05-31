
import { useState, useEffect } from 'react';
import { ActiveSessionData } from '@/types/training';

export function useLocalSession() {
  const [localSession, setLocalSession] = useState<ActiveSessionData | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('activeTrainingSession');
    if (stored) {
      try {
        setLocalSession(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('activeTrainingSession');
      }
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (localSession) {
      localStorage.setItem('activeTrainingSession', JSON.stringify(localSession));
    } else {
      localStorage.removeItem('activeTrainingSession');
    }
  }, [localSession]);

  const updateLocalSession = (updates: Partial<ActiveSessionData>) => {
    if (localSession) {
      setLocalSession({ ...localSession, ...updates });
    }
  };

  return {
    localSession,
    setLocalSession,
    updateLocalSession
  };
}
