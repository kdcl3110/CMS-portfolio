import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import socialService from "../services/experience.service";
import initialState from "../initialStore/experience";
import { ExperienceFormPayload } from "../interfaces/experience";

export const createExperience = createAsyncThunk<
  any,
  ExperienceFormPayload,
  { rejectValue: string }
>("experience/createExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.createExperience(data);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.message || error.message || error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});


export const getExperiences = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("experience/getExperiences", async (data, thunkAPI) => {
  try {
    const response = await socialService.getExperiences(data.userId);
    thunkAPI.dispatch(replaceExperiences(response));
    return response;
  } catch (error: any) {
    const message =
      error?.response?.message || error.message || error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExperience = createAsyncThunk<
  any,
  { id: number; data: ExperienceFormPayload },
  { rejectValue: string }
>("experience/updateExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.updateExperience(data.id, data.data);
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

export const deleteExperience = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("experience/deleteExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.deleteExperience(data.id);
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

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    replaceExperiences(state, action) {
      return {
        ...state,
        experiences: action.payload,
      };
    },
  },
});
const { reducer, actions } = experienceSlice;

export const { replaceExperiences } = actions;
export default reducer;
