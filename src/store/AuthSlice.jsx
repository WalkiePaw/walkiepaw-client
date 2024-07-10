import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice(
    {
  name: 'auth',
      initialState: {
    isLoggedIn: false,
        token: null,
        user: null,
        error: null,
      },
      reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
     },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      },
    },
});

export const {loginSuccess, loginFailure, logout} = authSlice.actions;
export default authSlice.reducer;