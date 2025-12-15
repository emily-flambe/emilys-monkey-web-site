export interface Env {
  DB: D1Database;
}

export interface Session {
  id: string;
  created_at: string;
  completed_at: string | null;
  agreement_score: number | null;
}

export interface Trial {
  id: number;
  session_id: string;
  trial_number: number;
  left_face: string;
  right_face: string;
  selected_face: string;
  response_time_ms: number | null;
  created_at: string;
}

export interface FaceStats {
  face_id: string;
  times_shown: number;
  times_selected: number;
  niceness_score: number;
}
