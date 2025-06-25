import { ContactPayload } from "../interfaces/contact";
import api from "./api";

const updateContact = async (id: number, data: ContactPayload) => {
  return api
    .put(`/contacts/${id}/`, data)
    .then((response: any) => {
      return response.data;
    });
};

const getContacts = async (userId: number) => {
  return api.get(`/contacts/${userId}/`).then((response: any) => {
    return response.data;
  });
};

const deleteContact = async (contactId: number) => {
  return api.delete(`/contacts/${contactId}/`).then((response: any) => {
    return response.data;
  });
};

const contactService = {
  updateContact,
  getContacts,
  deleteContact,
};
export default contactService;
