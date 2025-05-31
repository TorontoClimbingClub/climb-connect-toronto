
import { useState, useEffect } from 'react';
import { ActiveSessionData } from '@/types/training';

interface OfflineSession extends ActiveSessionData {
  id: string;
  startTime: string;
  endTime?: string;
}

export function useOfflineTrainer() {
  const [activeSession, setActiveSession] = useState<OfflineSession | null>(null);
  const [allSessions, setAllSessions] = useState<OfflineSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedActiveSession = localStorage.getItem('trainer_active_session');
      if (storedActiveSession) {
        setActiveSession(JSON.parse(storedActiveSession));
      }

      const storedSessions = localStorage.getItem('trainer_all_sessions');
      if (storedSessions) {
        setAllSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error('Failed to load trainer data from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('trainer_active_session', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('trainer_active_session');
    }
  }, [activeSession]);

  // Save all sessions to localStorage
  useEffect(() => {
    localStorage.setItem('trainer_all_sessions', JSON.stringify(allSessions));
  }, [allSessions]);

  const startSession = (initialData: Partial<ActiveSessionData>) => {
    const newSession: OfflineSession = {
      id: Date.now().toString(),
      sessionDate: new Date().toISOString().split('T')[0],
      sessionGoal: initialData.sessionGoal,
      customGoal: initialData.customGoal,
      warmUpDone: false,
      feltTiredAtEnd: false,
      newTechniquesTried: false,
      climbs: [],
      techniques: [],
      startTime: new Date().toISOString()
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

  const updateSession = (updates: Partial<ActiveSessionData>) => {
    if (activeSession) {
      setActiveSession({ ...activeSession, ...updates });
    }
  };

  const addClimb = (climb: any) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        climbs: [...activeSession.climbs, { ...climb, id: Date.now().toString() }]
      });
    }
  };

  const updateClimb = (climbId: string, updates: any) => {
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

  const addTechnique = (technique: string) => {
    if (activeSession && !activeSession.techniques.includes(technique)) {
      setActiveSession({
        ...activeSession,
        techniques: [...activeSession.techniques, technique]
      });
    }
  };

  const removeTechnique = (technique: string) => {
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        techniques: activeSession.techniques.filter(t => t !== technique)
      });
    }
  };

  const getSessionStats = () => {
    const totalSessions = allSessions.length;
    const totalClimbs = allSessions.reduce((sum, session) => sum + session.climbs.length, 0);
    const uniqueGrades = new Set(allSessions.flatMap(session => 
      session.climbs.map(climb => climb.routeGrade)
    ));
    
    return {
      totalSessions,
      totalClimbs,
      uniqueGrades: uniqueGrades.size,
      averageClimbsPerSession: totalSessions > 0 ? Math.round(totalClimbs / totalSessions) : 0
    };
  };

  return {
    activeSession,
    allSessions,
    isLoading,
    hasActiveSession: !!activeSession,
    startSession,
    endSession,
    updateSession,
    addClimb,
    updateClimb,
    removeClimb,
    addTechnique,
    removeTechnique,
    getSessionStats
  };
}
