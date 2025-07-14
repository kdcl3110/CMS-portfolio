import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import socialService from "../services/service.service";
import initialState from "../initialStore/service";

export const createService = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("services/createService", async (data, thunkAPI) => {
  try {
    const response = await socialService.createService(data);
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


export const getServices = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("services/getServices", async (data, thunkAPI) => {
  try {
    const response = await socialService.getServices(data.userId);
    thunkAPI.dispatch(replaceServices(response));
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

export const getMyServices = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("services/getMyServices", async (data, thunkAPI) => {
  try {
    const response = await socialService.getMyServices();
    thunkAPI.dispatch(replaceServices(response));
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

export const updateService = createAsyncThunk<
  any,
  { id: number; data: FormData },
  { rejectValue: string }
>("services/updateService", async (data, thunkAPI) => {
  try {
    const response = await socialService.updateService(data.id, data.data);
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

export const deleteService = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("services/deleteService", async (data, thunkAPI) => {
  try {
    const response = await socialService.deleteService(data.id);
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

const ServiceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    replaceServices(state, action) {
      return {
        ...state,
        services: action.payload,
      };
    },
  },
});
const { reducer, actions } = ServiceSlice;

export const { replaceServices } = actions;
export default reducer;
