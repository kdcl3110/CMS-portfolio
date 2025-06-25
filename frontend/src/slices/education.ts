import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import socialService from "../services/education.service";
import initialState from "../initialStore/education";
import { EducationFormPayload } from "../interfaces/education";

export const createExperience = createAsyncThunk<
  any,
  EducationFormPayload,
  { rejectValue: string }
>("education/createExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.createEducation(data);
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
>("education/getExperiences", async (data, thunkAPI) => {
  try {
    const response = await socialService.getEducations(data.userId);
    thunkAPI.dispatch(replaceEducation(response));
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
  { id: number; data: EducationFormPayload },
  { rejectValue: string }
>("education/updateExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.updateEducation(data.id, data.data);
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
>("education/deleteExperience", async (data, thunkAPI) => {
  try {
    const response = await socialService.deleteEducation(data.id);
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

const educationSlice = createSlice({
  name: "education",
  initialState,
  reducers: {
    replaceEducation(state, action) {
      return {
        ...state,
        educations: action.payload,
      };
    },
  },
});
const { reducer, actions } = educationSlice;

export const { replaceEducation } = actions;
export default reducer;
