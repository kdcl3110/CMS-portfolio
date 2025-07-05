import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import socialService from "../services/contact.service";
import initialState from "../initialStore/contact";
import { ContactPayload } from "../interfaces/contact";

export const getMyContacts = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>("contact/getMyContacts", async (data = "", thunkAPI) => {
  try {
    const response = await socialService.getMyContacts();
    thunkAPI.dispatch(replaceContact(response));
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

export const getContacts = createAsyncThunk<
  any,
  { userId: number },
  { rejectValue: string }
>("contact/getContacts", async (data, thunkAPI) => {
  try {
    const response = await socialService.getContacts(data.userId);
    thunkAPI.dispatch(replaceContact(response));
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

export const updateContact = createAsyncThunk<
  any,
  { id: number; data: ContactPayload },
  { rejectValue: string }
>("contact/updateContact", async (data, thunkAPI) => {
  try {
    const response = await socialService.updateContact(data.id, data.data);
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

export const deleteContact = createAsyncThunk<
  any,
  { id: number },
  { rejectValue: string }
>("contact/deleteContact", async (data, thunkAPI) => {
  try {
    const response = await socialService.deleteContact(data.id);
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

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    replaceContact(state, action) {
      return {
        ...state,
        contacts: action.payload,
      };
    },
  },
});
const { reducer, actions } = contactSlice;

export const { replaceContact } = actions;
export default reducer;
