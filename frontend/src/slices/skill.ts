import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import skillService from "../services/skill.service";
import initialState from "../initialStore/skill";
import { SkillPayload } from "../interfaces/skill";

export const createSkill = createAsyncThunk<
  any,
  SkillPayload,
  { rejectValue: string }
>("social/createSkill", async (data, thunkAPI) => {
  try {
    const response = await skillService.createSkill(data);
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

export const getSkills = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("social/getSkills", async (data, thunkAPI) => {
  try {
    const response = await skillService.getSkills(data.userId);
    thunkAPI.dispatch(replaceSkills(response));
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

export const getMySkills = createAsyncThunk<any, any, { rejectValue: string }>(
  "social/getMySkills",
  async (data, thunkAPI) => {
    try {
      const response = await skillService.getMySkills();
      thunkAPI.dispatch(replaceSkills(response));
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

export const updateSkill = createAsyncThunk<
  any,
  { id: number; data: SkillPayload },
  { rejectValue: string }
>("social/updateSkill", async (data, thunkAPI) => {
  try {
    const response = await skillService.updateSkill(data.id, data.data);
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

export const deleteSkill = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("social/deleteSkill", async (data, thunkAPI) => {
  try {
    const response = await skillService.deleteSkill(data.id);
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

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {
    replaceSkills(state, action) {
      return {
        ...state,
        skills: action.payload,
      };
    },
  },
});
const { reducer, actions } = skillSlice;

export const { replaceSkills } = actions;
export default reducer;
