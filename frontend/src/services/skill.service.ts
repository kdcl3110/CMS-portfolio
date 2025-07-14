import { SkillPayload } from "../interfaces/skill";
import api from "./api";

const createSkill = async (data: SkillPayload) => {
  return api.post(`/skills/`, data).then((response: any) => {
    return response.data;
  });
};

const updateSkill = async (id: number, data: SkillPayload) => {
  return api.put(`/skills/${id}/`, data).then((response: any) => {
    return response.data;
  });
};

const getSkills = async (userId: number) => {
  return api.get(`/skills/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMySkills = async () => {
  return api.get(`/skills/my-skills/`).then((response: any) => {
    return response.data;
  });
};

const deleteSkill = async (skillId: number) => {
  return api.delete(`/skills/${skillId}/`).then((response: any) => {
    return response.data;
  });
};

const skillService = {
  updateSkill,
  getSkills,
  deleteSkill,
  createSkill,
  getMySkills
};
export default skillService;
