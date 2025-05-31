
export interface ClimbingRoute {
  id: string;
  name: string;
  grade: string;
  style: 'Trad' | 'Sport' | 'Top Rope';
  area: string;
  sector: string;
}

export interface RouteComment {
  id: string;
  route_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user_name: string;
  parent_id?: string;
  profiles?: {
    full_name: string;
  };
}

export interface RoutePhoto {
  id: string;
  route_id: string;
  user_id: string;
  photo_url: string;
  caption?: string;
  created_at: string;
  user_name: string;
}

export interface AreaDescription {
  id: string;
  name: string;
  type: 'area' | 'sector';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RouteGradeSubmission {
  id: string;
  route_id: string;
  user_id: string;
  submitted_grade: string;
  notes?: string;
  climbing_style: string;
  created_at: string;
  updated_at: string;
}

export interface RouteBetaGrade {
  route_id: string;
  beta_grade: string;
  submission_count: number;
  grade_distribution: Record<string, number>;
  last_updated: string;
}
