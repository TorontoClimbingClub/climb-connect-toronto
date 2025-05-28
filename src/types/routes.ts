
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
