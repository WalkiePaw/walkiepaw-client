import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';
import {verifyTokenApi, loginApi} from "../Api.jsx";

export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async (_, { rejectWithValue, getState }) => {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      try {
        await verifyTokenApi();
        // 토큰이 유효하다면, 이미 저장된 사용자 정보를 반환
        const { user } = getState().auth;
        return { user, token };
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Token verification failed');
      }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await loginApi(credentials);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    }
);


const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!localStorage.getItem('token'),
    isLoading: false,
    user: null,
    token: localStorage.getItem('token'),
    error: null,
    newUser: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.token = action.payload.token;
      const decodedToken = jwtDecode(action.payload.token);
      state.user = {
        id: decodedToken.id,
        email: decodedToken.email,
        authorities: decodedToken.role,
        nickname: decodedToken.nickname
      };
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setInitialState: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.isLoggedIn = true;
        state.token = token;
        try {
          const decodedToken = jwtDecode(token);
          state.user = {
            id: decodedToken.id,
            email: decodedToken.email,
            nickname: decodedToken.nickname,
            authorities: decodedToken.role
          };
        } catch (error) {
          state.isLoggedIn = false;
          state.user = null;
          localStorage.removeItem('token');
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(verifyToken.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verifyToken.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    })
    .addCase(verifyToken.rejected, (state) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.error = "Token verification failed";
      localStorage.removeItem('token');
    })
    .addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.token = action.payload.token;
      const decodedToken = jwtDecode(action.payload.token);
      state.user = {
        id: decodedToken.id,
        email: decodedToken.email,
        nickname: decodedToken.nickname,
        authorities: decodedToken.role
      };
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    })
    .addCase(login.rejected, (state, action) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    })
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  setLoading,
  setInitialState
} = AuthSlice.actions;

export default AuthSlice.reducer;