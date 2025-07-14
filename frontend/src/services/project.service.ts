import api from "./api";

const createProject = async (data: FormData) => {
  return api
    .post(`/projects/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: any) => {
      return response.data;
    });
};

const updateProject = async (id: number, data: FormData) => {
  return api
    .put(`/projects/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response: any) => {
      return response.data;
    });
};

const getProjects = async (userId: number) => {
  return api.get(`/projects/user/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const getMyProjects = async () => {
  return api.get(`/projects/my-projects/`).then((response: any) => {
    return response.data;
  });
};

const deleteProject = async (userId: number) => {
  return api.delete(`/projects/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const ProjectService = {
  createProject,
  updateProject,
  getProjects,
  deleteProject,
  getMyProjects,
};
export default ProjectService;
