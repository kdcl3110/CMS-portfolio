import api from "./api";

const getSocialTypes = async () => {
  return api.get(`/social_types/`).then((response: any) => {
    return response.data;
  });
};

const getCategories = async () => {
  return api.get(`/categories/`).then((response: any) => {
    return response.data;
  });
};

const skillService = {
  getSocialTypes,
  getCategories,
};
export default skillService;
