import { SocialType } from "../initialStore/utils";

export interface SocialPayload {
  social_type: number;
  link: string;
  user?: number;
}

export interface Social {
  id: number;
  socialType: number;
  social_type_detail: SocialType;
  user: number;
  link: string;
  created_at: string;
  updated_at: string;
}
