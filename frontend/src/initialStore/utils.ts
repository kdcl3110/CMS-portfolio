interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface SocialType {
  id: number;
  label: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export default {
  categories: [] as Category[],
  socialTypes: [] as SocialType[],
};
