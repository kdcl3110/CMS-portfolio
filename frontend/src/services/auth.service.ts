import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordConfirmPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
} from "../interfaces/auth";
import api from "./api";

const register = async (data: RegisterPayload) => {
  return api.post("/auth/register/", data).then((response: any) => {
    return response.data;
  });
};

const login = async (data: LoginPayload) => {
  return api.post("/auth/login/", data).then((response: any) => {
    return response.data;
  });
};

const logout = async () => {
  try {
    const refresh = localStorage.getItem("@Auth:refresh");

    if (!refresh) {
      throw new Error("Aucun refresh token trouvé");
    }
    const response = await api.post("/auth/logout/", {
      refresh,
    });

    return response.data;

    // return api.post("/auth/logout/", { refresh }).then((response: any) => {
    //   return response.data;
    // });
  } catch (error) {
    throw error;
  }
};

const editProfil = async (data: UpdateUserPayload) => {
  return api.put("/auth/profil/update/", data).then((response: any) => {
    return response.data;
  });
};

const viewProfil = async () => {
  return api.get("/auth/profil/").then((response: any) => {
    return response.data;
  });
};

const resetPassword = async (data: ResetPasswordPayload) => {
  return api.post("/auth/password-reset/", data).then((response: any) => {
    return response.data;
  });
};

const resetPasswordConfirmation = async (data: ResetPasswordConfirmPayload) => {
  return api
    .post("/auth/password-reset/confirm/", data)
    .then((response: any) => {
      return response.data;
    });
};

const authService = {
  login,
  logout,
  register,
  editProfil,
  resetPassword,
  viewProfil,
  resetPasswordConfirmation,
};
export default authService;
