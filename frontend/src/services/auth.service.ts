import api from "./api";

const login = async (username: string) => {
  return api.post("/auth/signin", { username }).then((response: any) => {
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
