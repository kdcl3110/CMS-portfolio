import { SocialType } from "./utils";


interface Social {
  id: number;
  socialType: SocialType;
  user: string;
  created_at: string;
  updated_at: string;
}

export default {
  socials: [] as Social[],
};
