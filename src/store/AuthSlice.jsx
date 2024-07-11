import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// 이 verifyToken 함수는 다음과 같이 동작합니다:
//
// 로컬 스토리지에서 토큰을 가져옵니다.
// 토큰이 있다면, 서버의 /api/v1/auth/verify 엔드포인트로 요청을 보냅니다.
// 서버에서 토큰이 유효하다고 응답하면, Redux 상태를 업데이트하여 로그인 상태를 유지합니다.
// 토큰이 유효하지 않다면, 로그아웃 처리를 합니다.
//
// 이 함수를 AuthSlice.jsx에 추가한 후에 App.jsx에서 사용할 수 있습니다. 이렇게 하면 앱이 시작될 때마다 저장된 토큰의 유효성을 검사하고, 적절히 로그인 상태를 관리할 수 있습니다.

export const verifyToken = createAsyncThunk(
    'auth/verifyToken',
    async (_, { rejectWithValue }) => {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      try {
        const response = await axios.get('http://localhost:8080/secured', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userInfo = {
          email: response.data.split('\n')[1].split(': ')[1],
          authorities: response.data.split('\n')[3].split(': ')[1]
        };
        return userInfo;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Token verification failed');
      }
    }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isLoading: false,
    user: null,
    token: localStorage.getItem('token'),
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
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
      state.error = null;
    })
    .addCase(verifyToken.rejected, (state) => {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.token = null;
      state.user = null;
      state.error = "Token verification failed";
      localStorage.removeItem('token');
    });
  },
});

export const { loginSuccess, loginFailure, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;