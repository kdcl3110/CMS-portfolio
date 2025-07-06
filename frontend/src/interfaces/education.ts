export interface Education {
  id: number;
  school: string;
  description: string;
  start_date: string;
  end_date: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export interface EducationFormPayload {
  school: string;
  start_date: string;
  end_date: string;
  description?: string;
  [key: string]: any;
}
