import { SocialType } from "./utils";

interface Social {
  id: number;
  socialType: number;
  social_type_detail: SocialType
  user: number;
  link: string;
  created_at: string;
  updated_at: string;
}

export default {
  socials: [] as Social[],
};
