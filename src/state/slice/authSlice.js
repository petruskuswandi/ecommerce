import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  loadUser,
  logoutUser,
  googleLogin,
  checkAuthStatus,
  uploadAvatar,
} from "../api/authApi";

const initialState = {
  isAuth: false,
  isLogout: false,
  authLoading: false,
  message: null,
  error: null,
  user: null,
  isUploadAvatar: false,
  isUploadAvatarLoading: false,
  isUploadAvatarError: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authReset: (state) => {
      state.isAuth = false;
      state.isLogout = false;
      state.authLoading = false;
      state.message = null;
      state.error = null;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    avatarReset: (state) => {
      state.isUploadAvatarLoading = false;
      state.isUploadAvatarError = false;
      state.isUploadAvatar = false;
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuth = true;
        state.isLogout = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.isAuth = false;
        state.isLogout = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuth = true;
        state.isLogout = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.authLoading = false;
        state.isAuth = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.isUploadAvatarLoading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isUploadAvatarLoading = false;
        state.isUploadAvatar = true;
        state.message = action.payload;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isUploadAvatarLoading = false;
        state.isUploadAvatar = false;
        state.isUploadAvatarError = true;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuth = false;
        state.isLogout = true;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.authLoading = false;
        state.isAuth = true;
        state.isLogout = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.authLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.authLoading = false;
        // The actual state update will happen when checkAuthStatus is called
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.authLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.authLoading = false;
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.authLoading = false;
        state.isAuth = false;
        state.user = null;
      });
  },
});

export const { authReset, clearError, avatarReset } = authSlice.actions;

export default authSlice.reducer;
