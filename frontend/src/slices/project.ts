import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import projectService from "../services/project.service";
import initialState from "../initialStore/project";
import { ProjectFormPayload } from "../interfaces/project";

export const createProject = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("projects/createProject", async (data, thunkAPI) => {
  try {
    const response = await projectService.createProject(data);
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


export const getProjects = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("projects/getProjects", async (data, thunkAPI) => {
  try {
    const response = await projectService.getProjects(data.userId);
    thunkAPI.dispatch(replaceProjects(response));
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

export const getMyProjects = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("projects/getMyProjects", async (data, thunkAPI) => {
  try {
    const response = await projectService.getMyProjects();
    thunkAPI.dispatch(replaceProjects(response));
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

export const updateProject = createAsyncThunk<
  any,
  { id: number; data: FormData },
  { rejectValue: string }
>("projects/updateProject", async (data, thunkAPI) => {
  try {
    const response = await projectService.updateProject(data.id, data.data);
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

export const deleteProject = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("projects/deleteProject", async (data, thunkAPI) => {
  try {
    const response = await projectService.deleteProject(data.id);
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

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    replaceProjects(state, action) {
      return {
        ...state,
        projects: action.payload,
      };
    },
  },
});
const { reducer, actions } = projectSlice;

export const { replaceProjects } = actions;
export default reducer;
