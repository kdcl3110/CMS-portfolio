import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";
import initialState from "../initialStore/auth";
import {
  LoginPayload,
  RegisterPayload,
  ResetPasswordConfirmPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
} from "../interfaces/auth";

export interface AuthState {
  currentUser: any;
  isLoggedIn: boolean;
  socket: any;
}

export const login = createAsyncThunk<
  any,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (data, thunkAPI) => {
  try {
    const response = await AuthService.login(data);
    thunkAPI.dispatch(replaceIsLoggedIn(true));
    thunkAPI.dispatch(replaceCurrentUser(response?.user));
    localStorage.setItem("user", JSON.stringify(response?.user));
    localStorage.setItem("@Auth:token", response?.tokens?.access);
    localStorage.setItem("@Auth:refresh", response?.tokens?.refresh);
    thunkAPI.dispatch(setMessage("Connexion réussie"));

    return response;
  } catch (error: any) {
    console.log(error);

    const errors = error?.response?.data;

    let message = "Une erreur est survenue";

    if (errors && typeof errors === "object") {
      // Concatène tous les messages d'erreur (ex: password, email, etc.)
      message = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.join(" ");
          }
          return messages; // fallback si ce n’est pas un tableau
        })
        .join(" ");
    } else {
      // Fallback si ce n’est pas un objet structuré
      message = error.message || error.toString();
    }

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const register = createAsyncThunk<
  any,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (data, thunkAPI) => {
  try {
    const response = await AuthService.register(data);
    thunkAPI.dispatch(replaceIsLoggedIn(true));
    thunkAPI.dispatch(replaceCurrentUser(response?.user));
    localStorage.setItem("user", JSON.stringify(response?.user));
    localStorage.setItem("@Auth:token", response?.tokens?.access);
    localStorage.setItem("@Auth:refresh", response?.tokens?.refresh);
    thunkAPI.dispatch(setMessage("Inscription réussie"));

    return response;
  } catch (error: any) {
    console.log(error);

    const errors = error?.response?.data;

    let message = "Une erreur est survenue";

    if (errors && typeof errors === "object") {
      // Concatène tous les messages d'erreur (ex: password, email, etc.)
      message = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.join(" ");
          }
          return messages; // fallback si ce n’est pas un tableau
        })
        .join(" ");
    } else {
      // Fallback si ce n’est pas un objet structuré
      message = error.message || error.toString();
    }

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
    // console.log(error);

    // const message =
    //   error?.response?.data?.message || error.message || error.toString();
    // thunkAPI.dispatch(setMessage(message));
    // return thunkAPI.rejectWithValue(message);
  }
});

export const updateProfil = createAsyncThunk<any, any, { rejectValue: string }>(
  "auth/updateProfil",
  async (data, thunkAPI) => {
    try {
      const response = await AuthService.editProfil(data);
      localStorage.setItem("user", JSON.stringify(response?.user));
      thunkAPI.dispatch(replaceCurrentUser(response?.user));
      thunkAPI.dispatch(setMessage("Mis à jour réussie"));
      return response;
    } catch (error: any) {
      console.log(error);

      const errors = error?.response?.data;

      let message = "Une erreur est survenue";

      if (errors && typeof errors === "object") {
        // Concatène tous les messages d'erreur (ex: password, email, etc.)
        message = Object.entries(errors)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(" ");
            }
            return messages; // fallback si ce n’est pas un tableau
          })
          .join(" ");
      } else {
        // Fallback si ce n’est pas un objet structuré
        message = error.message || error.toString();
      }

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("auth/getCurrentUser", async (data, thunkAPI) => {
  try {
    const response = await AuthService.getCurrentUser();
    thunkAPI.dispatch(replaceCurrentUser(response));
    thunkAPI.dispatch(setMessage("Mis à jour réussie"));
    return response;
  } catch (error: any) {
    console.log(error);

    const errors = error?.response?.data;

    let message = "Une erreur est survenue";

    if (errors && typeof errors === "object") {
      // Concatène tous les messages d'erreur (ex: password, email, etc.)
      message = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.join(" ");
          }
          return messages; // fallback si ce n’est pas un tableau
        })
        .join(" ");
    } else {
      // Fallback si ce n’est pas un objet structuré
      message = error.message || error.toString();
    }

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk<
  any,
  ResetPasswordPayload,
  { rejectValue: string }
>("auth/resetPassword", async (data, thunkAPI) => {
  try {
    const response = await AuthService.resetPassword(data);
    thunkAPI.dispatch(setMessage("Email de réinitialisation envoyé"));
    return response;
  } catch (error: any) {
    console.log(error);

    const errors = error?.response?.data;

    let message = "Une erreur est survenue";

    if (errors && typeof errors === "object") {
      // Concatène tous les messages d'erreur (ex: password, email, etc.)
      message = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.join(" ");
          }
          return messages; // fallback si ce n’est pas un tableau
        })
        .join(" ");
    } else {
      // Fallback si ce n’est pas un objet structuré
      message = error.message || error.toString();
    }

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetPasswordConfirmation = createAsyncThunk<
  any,
  ResetPasswordConfirmPayload,
  { rejectValue: string }
>("auth/resetPassword", async (data, thunkAPI) => {
  try {
    const response = await AuthService.resetPasswordConfirmation(data);
    thunkAPI.dispatch(setMessage("Mot de passe réinitialisé avec succès"));
    return response;
  } catch (error: any) {
    console.log(error);

    const errors = error?.response?.data;

    let message = "Une erreur est survenue";

    if (errors && typeof errors === "object") {
      // Concatène tous les messages d'erreur (ex: password, email, etc.)
      message = Object.entries(errors)
        .map(([field, messages]) => {
          if (Array.isArray(messages)) {
            return messages.join(" ");
          }
          return messages; // fallback si ce n’est pas un tableau
        })
        .join(" ");
    } else {
      // Fallback si ce n’est pas un objet structuré
      message = error.message || error.toString();
    }

    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk<any, any, { rejectValue: string }>(
  "auth/updateProfil",
  async (data, thunkAPI) => {
    try {
      const response = await AuthService.logout();
      thunkAPI.dispatch(
        replaceCurrentUser({
          id: null,
          username: "",
          email: "",
          firstName: "",
          lastName: "",
        })
      );
      thunkAPI.dispatch(replaceIsLoggedIn(false));
      localStorage.removeItem("user");
      localStorage.removeItem("@Auth:token");
      localStorage.removeItem("@Auth:refresh");
      thunkAPI.dispatch(setMessage("Déconnexion réussie"));
      return response;
    } catch (error: any) {
      console.log(error);

      const errors = error?.response?.data;

      let message = "Une erreur est survenue";

      if (errors && typeof errors === "object") {
        // Concatène tous les messages d'erreur (ex: password, email, etc.)
        message = Object.entries(errors)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(" ");
            }
            return messages; // fallback si ce n’est pas un tableau
          })
          .join(" ");
      } else {
        // Fallback si ce n’est pas un objet structuré
        message = error.message || error.toString();
      }

      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    replaceCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    replaceIsLoggedIn(state, action) {
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    },
  },
});
const { reducer, actions } = authSlice;

export const { replaceCurrentUser, replaceIsLoggedIn } = actions;
export default reducer;
