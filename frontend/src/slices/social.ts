import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import socialService from "../services/social.service";
import initialState from "../initialStore/social";
import { SocialPayload } from "../interfaces/social";

export const createSocials = createAsyncThunk<
  any,
  SocialPayload,
  { rejectValue: string }
>("social/createSocials", async (data, thunkAPI) => {
  try {
    const response = await socialService.createSocial(data);
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

export const getSocials = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("social/getSocials", async (data, thunkAPI) => {
  try {
    const response = await socialService.getSocials(data.userId);
    thunkAPI.dispatch(replaceSocials(response));
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

export const getMySocials = createAsyncThunk<any, any, { rejectValue: string }>(
  "social/getMySocials",
  async (data, thunkAPI) => {
    try {
      const response = await socialService.getMySocials();
      thunkAPI.dispatch(replaceSocials(response));
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

export const updateSocial = createAsyncThunk<
  any,
  { id: number; data: SocialPayload },
  { rejectValue: string }
>("social/getSocialTypes", async (data, thunkAPI) => {
  try {
    const response = await socialService.updateSocial(data.id, data.data);
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

export const deleteSocial = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("social/deleteSocial", async (data, thunkAPI) => {
  try {
    const response = await socialService.deleteSocial(data.id);
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

const socialSlice = createSlice({
  name: "social",
  initialState,
  reducers: {
    replaceSocials(state, action) {
      return {
        ...state,
        socials: action.payload,
      };
    },
  },
});
const { reducer, actions } = socialSlice;

export const { replaceSocials } = actions;
export default reducer;
