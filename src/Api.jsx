import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8080", // 실제 API 서버 주소로 변경하세요
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const verifyTokenApi = () => Api.get("/secured");

export const loginApi = (credentials) =>
  Api.post("api/v1/auth/login", credentials);

export const createChatroom = async (postId, memberId) => {
  const chatroomData = {
    board_id: postId, // `boardId`를 `postId`로 받아 사용
  };

  const createChatroomData = {
    boardId: postId,
    memberId: memberId,
  };

  return Api.get(`/api/v1/chatrooms/${memberId}`, {
    params: chatroomData,
  })
    .then((checkChatroomResponse) => {
      if (checkChatroomResponse.data && checkChatroomResponse.data.chatroomId) {
        return checkChatroomResponse.data;
      }
    })
    .catch((e) => {
      return Api.post(`/api/v1/chatrooms`, createChatroomData);
    })
    .then((response) => {
      if (response.data) {
        return response.data;
      }
      return response;
    })
    .catch((error) => {
      throw new Error("채팅방 생성 실패:", error);
    });
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
