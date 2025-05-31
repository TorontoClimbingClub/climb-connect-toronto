
export interface SimplifiedClimb {
  id: string;
  grade: string;
  durationMinutes: number;
  numberOfTakes: number;
  createdAt: string;
}

export interface SimplifiedSession {
  id: string;
  startTime: string;
  endTime?: string;
  climbs: SimplifiedClimb[];
}

export interface SessionStats {
  totalSessions: number;
  totalClimbs: number;
  averageSessionDuration: number;
  averageClimbsPerSession: number;
  totalSessionTime: number;
}
