interface Experience {
  id: number;
  company: string;
  description: string;
  start_date: string;
  end_date: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export default {
  experiences: [] as Experience[],
};
