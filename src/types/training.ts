
export interface SimplifiedClimb {
  id: string;
  grade: string;
  durationMinutes: number;
  numberOfTakes: number;
  createdAt: string;
}

export interface WorkoutMetrics {
  maxHangTime: number; // seconds
  maxPullUps: number;
  maxLockoff: number; // seconds
}

export interface SimplifiedSession {
  id: string;
  startTime: string;
  endTime?: string;
  climbs: SimplifiedClimb[];
  workoutMetrics?: WorkoutMetrics;
  sii?: number; // Session Intensity Index
  recoveryFeeling?: number; // 1-5 scale
  restDaysBeforeSession?: number;
}

export interface SessionStats {
  totalSessions: number;
  totalClimbs: number;
  averageSessionDuration: number;
  averageClimbsPerSession: number;
  totalSessionTime: number;
  averageSII?: number;
}

export interface SIIComponents {
  physicalLoad: number;
  performanceLoad: number;
  durationFactor: number;
  sii: number;
}

export interface RecoveryRecommendation {
  recommendedRestDays: number;
  reason: string;
  confidenceLevel: 'low' | 'medium' | 'high';
}

// Legacy type for backwards compatibility
export interface ActiveSessionData {
  sessionDate: string;
  sessionGoal?: string;
  customGoal?: string;
  warmUpDone: boolean;
  feltTiredAtEnd: boolean;
  newTechniquesTried: boolean;
  climbs: any[];
  techniques: string[];
  feltAfterSession?: string;
  wouldChangeNextTime?: string;
}
