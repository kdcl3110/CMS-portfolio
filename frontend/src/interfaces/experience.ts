export interface ExperienceFormPayload {
  company: string;
  start_date: string;
  end_date: string;
  description?: string;
  [key: string]: any;
}