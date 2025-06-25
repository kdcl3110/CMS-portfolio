import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import UtilsService from "../services/utils.service";
import initialState from "../initialStore/utils";

export const getCategories = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("utils/getCategories", async (data, thunkAPI) => {
  try {
    const response = await UtilsService.getCategories();
    thunkAPI.dispatch(replaceCategories(response));
    return response;
  } catch (error: any) {
    const message =
      error?.response?.message || error.message || error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const getSocialTypes = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("utils/getSocialTypes", async (data, thunkAPI) => {
  try {
    const response = await UtilsService.getSocialTypes();
    thunkAPI.dispatch(replaceSocialType(response));
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

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    replaceCategories(state, action) {
      return {
        ...state,
        categories: action.payload,
      };
    },
    replaceSocialType(state, action) {
      return {
        ...state,
        socialTypes: action.payload,
      };
    },
  },
});
const { reducer, actions } = utilsSlice;

export const { replaceCategories, replaceSocialType } = actions;
export default reducer;
