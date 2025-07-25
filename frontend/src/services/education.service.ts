import { EducationFormPayload } from "../interfaces/education";
import api from "./api";

const createEducation = async (data: EducationFormPayload) => {
  return api.post(`/educations/`, data).then((response: any) => {
    return response.data;
  });
};

const updateEducation = async (id: number, data: EducationFormPayload) => {
  return api.put(`/educations/${id}/`, data).then((response: any) => {
    return response.data;
  });
};

const getEducations = async (userId: number) => {
  return api.get(`/educations/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMyEducations = async () => {
  return api.get(`/educations/my-educations/`).then((response: any) => {
    return response.data;
  });
};

const deleteEducation = async (userId: number) => {
  return api.delete(`/educations/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const educationService = {
  createEducation,
  updateEducation,
  getEducations,
  deleteEducation,
  getMyEducations
};
export default educationService;
