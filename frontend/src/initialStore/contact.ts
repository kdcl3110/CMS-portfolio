interface Contact {
  id: number;
  name: string;
  email: string;
  user: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export default {
  contacts: [] as Contact[],
};
