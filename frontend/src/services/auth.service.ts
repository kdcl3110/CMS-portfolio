import api from "./api";

const login = async (email: string, password: string) => {
  return api.post("/auth/signin", { email, password }).then((response: any) => {
    return response.data;
  });
};

const logout = () => {
  // localStorage.removeItem("@Auth:token");
  localStorage.removeItem("user");
  return "true";
};

const authService = {
  login,
  logout,
};
export default authService;
