export interface ProjectFormPayload {
  title: string;
  description?: string;
  user: string;
  company: string;
  start_date: string;
  end_date: string;
  [key: string]: any;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  user: string;
  github_url: string;
  demo_url: string;
  technologies: any;
  image_url: string;
  technologies_string: string;
  image: string;
  created_at: string;
  updated_at: string;
}
