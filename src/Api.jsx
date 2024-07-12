import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:8080', // 실제 API 서버 주소로 변경하세요
});

Api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

export const verifyTokenApi = () => Api.get('/secured');

export const loginApi = (credentials) => Api.post('api/v1/auth/login', credentials);

// export const getUserProfile = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const response = await Api.get('/user/profile', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch user profile:', error);
//     throw error;
//   }
// };

export default Api;