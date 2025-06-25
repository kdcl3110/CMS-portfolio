interface Skill {
  id: number;
  label: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export default {
  skills: [] as Skill[],
};
