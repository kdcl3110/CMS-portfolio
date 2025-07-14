import { SocialPayload } from "../interfaces/social";
import api from "./api";

const createSocial = async (data: SocialPayload) => {
  return api.post(`/socials/`, data).then((response: any) => {
    return response.data;
  });
};

const updateSocial = async (id: number, data: SocialPayload) => {
  return api.put(`/socials/${id}/`, data).then((response: any) => {
    return response.data;
  });
};

const getSocials = async (userId: number) => {
  return api.get(`/socials/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMySocials = async () => {
  return api.get(`/socials/my-socials/`).then((response: any) => {
    return response.data;
  });
};

const deleteSocial = async (userId: number) => {
  return api.delete(`/socials/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const SocialService = {
  createSocial,
  updateSocial,
  getSocials,
  deleteSocial,
  getMySocials,
};
export default SocialService;
