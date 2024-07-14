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

export const createChatroom = async (postId, memberId) => {
  const chatroomData = {
    boardId: postId,  // `boardId`를 `postId`로 받아 사용
    memberId,
  };

  try {
    const response = await Api.post('/api/v1/chatrooms', chatroomData);
    return response.data;
  } catch (error) {
    throw new Error('채팅방 생성 실패:', error);
  }
};

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