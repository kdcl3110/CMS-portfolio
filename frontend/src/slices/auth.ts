import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message";
import AuthService from "../services/auth.service";
import initialState from "../initialStore/auth";

const user = JSON.parse(localStorage.getItem("user") || "null");

interface LoginPayload {
  username: string;
}
export interface AuthState {
  currentUser: any;
  isLoggedIn: boolean;
  socket: any;
}
export const login = createAsyncThunk<
  any,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async ({ username }, thunkAPI) => {
  try {
    const response = await AuthService.login(username);
    thunkAPI.dispatch(replaceIsLoggedIn(true));
    thunkAPI.dispatch(replaceCurrentUser(response.data));
    localStorage.setItem("user", JSON.stringify(response.data));

    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || error.toString();
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

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
    replaceSocket(state, action) {
      return {
        ...state,
        socket: action.payload,
      };
    },
  },
});
const { reducer, actions } = authSlice;

export const { replaceCurrentUser, replaceIsLoggedIn, replaceSocket } = actions;
export default reducer;
