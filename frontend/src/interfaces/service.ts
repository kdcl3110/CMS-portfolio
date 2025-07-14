export interface ServiceFormPayload {
  company: string;
  start_date: string;
  end_date: string;
  description?: string;
  title: string;
  [key: string]: any;
}

export interface Service {
  id: number;
  title: string;
  description?: string;
  user: string;
  duration_hours: number;
  duration_display: string;
  price: number;
  price_display: string;
  icon_url: string;
  is_active: boolean;
  tags: any;
  tags_string: string;
  created_at: string;
  updated_at: string;
}