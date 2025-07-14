import api from "./api";

const createService = async (data: FormData) => {
  return api
    .post(`/services/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: any) => {
      return response.data;
    });
};

const updateService = async (id: number, data: FormData) => {
  return api
    .put(`/services/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: any) => {
      return response.data;
    });
};

const getServices = async (userId: number) => {
  return api.get(`/services/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMyServices = async () => {
  return api.get(`/services/my-services/`).then((response: any) => {
    return response.data;
  });
};

const deleteService = async (userId: number) => {
  return api.delete(`/services/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const ServiceService = {
  createService,
  updateService,
  getServices,
  deleteService,
  getMyServices,
};
export default ServiceService;
