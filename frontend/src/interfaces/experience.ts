export interface ExperienceFormPayload {
  company: string;
  start_date: string;
  end_date: string;
  description?: string;
  title: string;
  [key: string]: any;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  user: string;
  created_at: string;
  updated_at: string;
}