import { ExperienceFormPayload } from "../interfaces/experience";
import api from "./api";

const createExperience = async (data: ExperienceFormPayload) => {
  return api.post(`/experiences/`, data).then((response: any) => {
    return response.data;
  });
};

const updateExperience = async (id: number, data: ExperienceFormPayload) => {
  return api.put(`/experiences/${id}/`, data).then((response: any) => {
    return response.data;
  });
};

const getExperiences = async (userId: number) => {
  return api.get(`/experiences/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMyExperiences = async () => {
  return api.get(`/experiences/my-experiences/`).then((response: any) => {
    return response.data;
  });
};

const deleteExperience = async (userId: number) => {
  return api.delete(`/experiences/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const ExperienceService = {
  createExperience,
  updateExperience,
  getExperiences,
  deleteExperience,
  getMyExperiences
};
export default ExperienceService;
