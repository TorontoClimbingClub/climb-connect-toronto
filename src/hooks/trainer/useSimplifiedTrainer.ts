
import { useState, useEffect } from 'react';
import { SimplifiedSession, SimplifiedClimb, SessionStats } from '@/types/training';

export function useSimplifiedTrainer() {
  const [activeSession, setActiveSession] = useState<SimplifiedSession | null>(null);
  const [allSessions, setAllSessions] = useState<SimplifiedSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedActiveSession = localStorage.getItem('simplified_trainer_active_session');
      if (storedActiveSession) {
        setActiveSession(JSON.parse(storedActiveSession));
      }

      const storedSessions = localStorage.getItem('simplified_trainer_all_sessions');
      if (storedSessions) {
        setAllSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error('Failed to load simplified trainer data from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('simplified_trainer_active_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('simplified_trainer_active_session');
    }
  }, [activeSession]);

  // Save all sessions to localStorage
  useEffect(() => {
    localStorage.setItem('simplified_trainer_all_sessions', JSON.stringify(allSessions));
  }, [allSessions]);

  const startSession = () => {
    const newSession: SimplifiedSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      climbs: []
    };
    
    setActiveSession(newSession);
    return Promise.resolve();
  };

  const endSession = () => {
    if (!activeSession) return Promise.reject('No active session');

    const completedSession = {
      ...activeSession,
      endTime: new Date().toISOString()
    };

    setAllSessions(prev => [completedSession, ...prev]);
    setActiveSession(null);
    return Promise.resolve();
  };

  const deleteSession = (sessionId: string) => {
    setAllSessions(prev => prev.filter(session => session.id !== sessionId));
    return Promise.resolve();
  };

  const addClimb = (climbData: { grade: string; durationMinutes: number; numberOfTakes: number }) => {
    if (activeSession) {
      const newClimb: SimplifiedClimb = {
        id: Date.now().toString(),
        grade: climbData.grade,
        durationMinutes: climbData.durationMinutes,
        numberOfTakes: climbData.numberOfTakes,
        createdAt: new Date().toISOString()
      };

      setActiveSession({
        ...activeSession,
        climbs: [...activeSession.climbs, newClimb]
      });
    }
  };

  const updateClimb = (climbId: string, updates: { grade: string; durationMinutes: number; numberOfTakes: number }) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        climbs: activeSession.climbs.map(climb => 
          climb.id === climbId ? { ...climb, ...updates } : climb
        )
      });
    }
  };

  const removeClimb = (climbId: string) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        climbs: activeSession.climbs.filter(climb => climb.id !== climbId)
      });
    }
  };

  const getSessionStats = (): SessionStats => {
    const totalSessions = allSessions.length;
    const totalClimbs = allSessions.reduce((sum, session) => sum + session.climbs.length, 0);
    
    // Calculate total session time in minutes
    const totalSessionTime = allSessions.reduce((sum, session) => {
      if (session.startTime && session.endTime) {
        const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
        return sum + Math.floor(duration / (1000 * 60)); // Convert to minutes
      }
      return sum;
    }, 0);

    const averageSessionDuration = totalSessions > 0 ? Math.round(totalSessionTime / totalSessions) : 0;
    const averageClimbsPerSession = totalSessions > 0 ? Math.round(totalClimbs / totalSessions) : 0;
    
    return {
      totalSessions,
      totalClimbs,
      averageSessionDuration,
      averageClimbsPerSession,
      totalSessionTime
    };
  };

  return {
    activeSession,
    allSessions,
    isLoading,
    hasActiveSession: !!activeSession,
    startSession,
    endSession,
    deleteSession,
    addClimb,
    updateClimb,
    removeClimb,
    getSessionStats
  };
}
