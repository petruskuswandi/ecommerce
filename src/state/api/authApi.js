import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const configImg = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
};

export const register = createAsyncThunk(
  "user/register",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.post("/user/register", userData, config);

      if (data.isRegister) {
        return { isRegister: true };
      } else {
        return thunkApi.rejectWithValue("Registration failed");
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkApi) => {
    try {
      const { data } = await axios.post("/user/login", userData, config);

      return data.user;
    } catch (error) {
      if (error.response.data && error.response.data) {
        return thunkApi.rejectWithValue(
          error.response.data.error || error.response.data.message
        );
      }
      return thunkApi.rejectWithValue("An error occurred during login!");
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "/user/uploadAvatar",
  async (file, thunkApi) => {
    try {
      const avatar = new FormData();
      avatar.append("file", file);

      const { data } = await axios.post(
        "/user/upload-avatar",
        avatar,
        configImg
      );

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  "/user/loadUser",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get("/user/profile", config);

      return data;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/user/logout",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.post("/user/logout", config);

      return data.message;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/google",
  async (_, thunkApi) => {
    try {
      window.open(`${axios.defaults.baseURL}/auth/google`, "_self");
      return;
    } catch (error) {
      return thunkApi.rejectWithValue("Failed to initiate Google login");
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, thunkApi) => {
    try {
      const { data } = await axios.get("/auth/status", config);
      return data.user;
    } catch (error) {
      return thunkApi.rejectWithValue("Not authenticated");
    }
  }
);
