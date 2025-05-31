
import { useState, useEffect } from 'react';
import { SimplifiedSession, SimplifiedClimb, SessionStats, WorkoutMetrics, SIIComponents, RecoveryRecommendation } from '@/types/training';

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

  const calculateSII = (session: SimplifiedSession): SIIComponents => {
    if (!session.workoutMetrics || session.climbs.length === 0) {
      return { physicalLoad: 0, performanceLoad: 0, durationFactor: 0, sii: 0 };
    }

    // Get recent sessions for rolling averages (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = allSessions.filter(s => 
      new Date(s.startTime) >= thirtyDaysAgo && s.workoutMetrics
    );

    // Calculate rolling averages
    const avgHang = recentSessions.length > 0 
      ? recentSessions.reduce((sum, s) => sum + (s.workoutMetrics?.maxHangTime || 0), 0) / recentSessions.length
      : session.workoutMetrics.maxHangTime || 1;
    
    const avgPullups = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + (s.workoutMetrics?.maxPullUps || 0), 0) / recentSessions.length
      : session.workoutMetrics.maxPullUps || 1;
    
    const avgLockoff = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => sum + (s.workoutMetrics?.maxLockoff || 0), 0) / recentSessions.length
      : session.workoutMetrics.maxLockoff || 1;

    const avgGrade = recentSessions.length > 0
      ? recentSessions.reduce((sum, s) => {
          const sessionAvgGrade = s.climbs.reduce((climbSum, climb) => {
            const gradeNum = parseFloat(climb.grade.replace('5.', ''));
            return climbSum + gradeNum;
          }, 0) / s.climbs.length;
          return sum + sessionAvgGrade;
        }, 0) / recentSessions.length
      : session.climbs.reduce((sum, climb) => sum + parseFloat(climb.grade.replace('5.', '')), 0) / session.climbs.length;

    // 1. Physical Load
    const hangRatio = session.workoutMetrics.maxHangTime / Math.max(avgHang, 1);
    const pullupRatio = session.workoutMetrics.maxPullUps / Math.max(avgPullups, 1);
    const lockoffRatio = session.workoutMetrics.maxLockoff / Math.max(avgLockoff, 1);
    const physicalLoad = (hangRatio + pullupRatio + lockoffRatio) / 3;

    // 2. Performance Load
    const currentGrade = session.climbs.reduce((sum, climb) => 
      sum + parseFloat(climb.grade.replace('5.', '')), 0
    ) / session.climbs.length;
    
    const gradeFactor = currentGrade / Math.max(avgGrade, 1);
    
    const totalTakes = session.climbs.reduce((sum, climb) => sum + climb.numberOfTakes, 0);
    const avgDuration = session.climbs.reduce((sum, climb) => sum + climb.durationMinutes, 0) / session.climbs.length;
    
    const baseEfficiency = 1.0;
    const fallPenalty = totalTakes * 0.1;
    const timePenalty = avgDuration > 10 ? (avgDuration - 10) * 0.02 : 0;
    const efficiencyFactor = baseEfficiency - fallPenalty - timePenalty;
    
    const performanceLoad = gradeFactor * Math.max(efficiencyFactor, 0.1);

    // 3. Duration Factor
    const sessionHours = session.endTime && session.startTime
      ? (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60 * 60)
      : 2; // default 2 hours if no end time
    
    const durationFactor = 0.7 + (sessionHours * 0.15);

    // Final SII calculation
    const sii = physicalLoad * performanceLoad * durationFactor;

    return { physicalLoad, performanceLoad, durationFactor, sii };
  };

  const endSession = (workoutMetrics?: WorkoutMetrics, recoveryFeeling?: number) => {
    if (!activeSession) return Promise.reject('No active session');

    const completedSession = {
      ...activeSession,
      endTime: new Date().toISOString(),
      workoutMetrics,
      recoveryFeeling
    };

    // Calculate SII
    const siiComponents = calculateSII(completedSession);
    completedSession.sii = siiComponents.sii;

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
    
    const sessionsWithSII = allSessions.filter(s => s.sii !== undefined);
    const averageSII = sessionsWithSII.length > 0
      ? sessionsWithSII.reduce((sum, s) => sum + (s.sii || 0), 0) / sessionsWithSII.length
      : undefined;
    
    return {
      totalSessions,
      totalClimbs,
      averageSessionDuration,
      averageClimbsPerSession,
      totalSessionTime,
      averageSII
    };
  };

  const getRecoveryRecommendation = (lastSII?: number): RecoveryRecommendation => {
    if (!lastSII || allSessions.length < 5) {
      return {
        recommendedRestDays: 1,
        reason: "Insufficient data for personalized recommendation",
        confidenceLevel: 'low'
      };
    }

    const baseRest = 1;
    let recommendedRestDays = baseRest;
    let reason = "";
    let confidenceLevel: 'low' | 'medium' | 'high' = 'medium';

    if (lastSII < 0.8) {
      recommendedRestDays = baseRest;
      reason = "Low intensity session - minimal recovery needed";
    } else if (lastSII < 1.2) {
      recommendedRestDays = baseRest + 1;
      reason = "Moderate intensity - standard recovery recommended";
    } else {
      recommendedRestDays = baseRest + Math.ceil((lastSII - 1.0) * 2);
      reason = "High intensity session - extended recovery recommended";
    }

    if (allSessions.length >= 20) {
      confidenceLevel = 'high';
    }

    return { recommendedRestDays, reason, confidenceLevel };
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
    getSessionStats,
    calculateSII,
    getRecoveryRecommendation
  };
}
