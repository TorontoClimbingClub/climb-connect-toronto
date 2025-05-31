
export interface LeaderboardUser {
  id: string;
  full_name: string;
  metric_value: number | string;
}

export interface LeaderboardData {
  topGradeClimbers: LeaderboardUser[];
  topTradClimbers: LeaderboardUser[];
  topSportClimbers: LeaderboardUser[];
  topTopRopeClimbers: LeaderboardUser[];
  topGearOwners: LeaderboardUser[];
  topEventAttendees: LeaderboardUser[];
}

export interface LeaderboardState extends LeaderboardData {
  loading: boolean;
  lastSync: number;
}
