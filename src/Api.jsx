import axios from 'axios';

const Api = axios.create({
  baseURL: '', // 실제 API 서버 주소로 변경하세요
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

// 일반 회원가입 API
export const signUpApi = (userData) => Api.post('/api/v1/members', userData);

// 소셜 회원가입 API
export const socialSignUpApi = (userData) => Api.post('/api/v1/members/social-signup', userData);

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

export const submitReview = async (reviewData) => {
  try {
    const response = await Api.post('/api/v1/reviews', reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error.response?.data || error.message);
    throw error;
  }
};

export const checkNickname = (nickname) =>
    Api.get('/api/v1/members/check-nickname', { params: { nickname } });

export const findEmail = (name, phoneNumber) =>
    Api.post('/api/v1/members/find-email', { name, phoneNumber });

export const sendVerificationEmail = (email) =>
    Api.post('/api/v1/mail/send', { email });

export const findPassword = (email, name) =>
    Api.post('/api/v1/members/find-passwd', { email, name });

export const verifyAuthCode = (email, authNum) =>
    Api.post('/api/v1/mail/authCheck', { email, authNum });

export const updatePassword = (memberId, password) =>
    Api.patch(`/api/v1/members/${memberId}/passwordUpdate`, { password });

export const handleSocialLogin = (provider) => {
  window.location.href = `${Api.defaults.baseURL}/oauth2/authorization/${provider}`;
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