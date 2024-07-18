import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from "axios";

let stompClient = null;

export const connectWebSocket = createAsyncThunk(
    'chat/connectWebSocket',
    async (_, { dispatch }) => {
      const socket = new SockJS('http://57.180.244.228:8000/ws');
      stompClient = Stomp.over(() => socket);

      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      return new Promise((resolve, reject) => {
        stompClient.connect(headers, () => {
          console.log('Connected to WebSocket');
          dispatch(webSocketConnected());
          resolve();
        }, (error) => {
          console.error('WebSocket connection error:', error);
          reject(error);
        });
      });
    }
);

export const disconnectWebSocket = createAsyncThunk(
    'chat/disconnectWebSocket',
    async (_, { dispatch }) => {
      if (stompClient) {
        await stompClient.disconnect();
        console.log('Disconnected from WebSocket');
        dispatch(webSocketDisconnected());
      }
    }
);

export const subscribeToChat = createAsyncThunk(
    'chat/subscribeToChat',
    async (chatroomId, { dispatch, getState }) => {
      if (stompClient && stompClient.connected) {
        const { auth } = getState();
        const subscription = stompClient.subscribe(`/chats/${chatroomId}`, (message) => {
          const payload = JSON.parse(message.body);
          const formattedMessage = {
            ...payload,
            isOutgoing: payload.writerId === auth.user.id,
            createDate: payload.createDate
          };
          dispatch(receiveMessage({
            chatroomId,
            message: formattedMessage
          }));
        });
        return { chatroomId, subscriptionId: subscription.id };
      } else {
        throw new Error('WebSocket is not connected');
      }
    }
);

export const sendWebSocketMessage = createAsyncThunk(
    'chat/sendWebSocketMessage',
    async ({ chatroomId, content }, { getState, dispatch }) => {
      const { auth } = getState();
      if (!auth.user || !auth.user.id) {
        throw new Error('User information not available');
      }

      const currentTime = new Date().toISOString();

      const message = {
        chatroomId: parseInt(chatroomId),
        content,
        writerId: auth.user.id,
        nickname: auth.user.nickname,
        createDate: currentTime,
        isOutgoing: true
      };

      if (stompClient && stompClient.connected) {
        try {
          await stompClient.send(`/api/v1/ws/chats/${chatroomId}`, {}, JSON.stringify(message));
          return message;
        } catch (error) {
          console.error('Failed to send message:', error);
          throw error;
        }
      } else {
        throw new Error('WebSocket is not connected');
      }
    }
);

export const setChatroomsThunk = createAsyncThunk(
    'chat/setChatroomsThunk',
    async (chatrooms, { dispatch }) => {
      const formattedChatrooms = chatrooms.map(room => ({
        ...room,
        boardTitle: room.boardTitle || '제목 없음',
      }));
      dispatch(setChatrooms(formattedChatrooms));
    }
);

export const updateChatroomStatus = createAsyncThunk(
    'chat/updateChatroomStatus',
    async ({ chatroomId, status }, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch('http://57.180.244.228:8000/api/v1/chatrooms/change-status', {
          chatroomId,
          status
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        return { chatroomId, status };
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},
    chatrooms: [],
    webSocketConnected: false,
    subscriptions: {},
  },
  reducers: {
    webSocketConnected: (state) => {
      state.webSocketConnected = true;
    },
    webSocketDisconnected: (state) => {
      state.webSocketConnected = false;
    },
    receiveMessage: (state, action) => {
      const { chatroomId, message } = action.payload;
      console.log('Received message:', message);  // 디버깅을 위한 로그
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      const formattedMessage = {
        ...message,
        createDate: message.createDate || new Date().toISOString(),
        nickname: message.nickname || 'Unknown User',  // 닉네임 추가
      };
      const isDuplicate = state.messages[chatroomId].some(msg => {
        const msgDate = new Date(msg.createDate);
        const newMsgDate = new Date(formattedMessage.createDate);
        return msg.content === formattedMessage.content &&
            msg.writerId === formattedMessage.writerId &&
            msgDate.getFullYear() === newMsgDate.getFullYear() &&
            msgDate.getMonth() === newMsgDate.getMonth() &&
            msgDate.getDate() === newMsgDate.getDate() &&
            msgDate.getHours() === newMsgDate.getHours() &&
            msgDate.getMinutes() === newMsgDate.getMinutes();
      });

      if (!isDuplicate) {
        state.messages[chatroomId].push(formattedMessage);
        const chatroomIndex = state.chatrooms.findIndex(room => room.id === chatroomId);
        if (chatroomIndex !== -1) {
          state.chatrooms[chatroomIndex] = {
            ...state.chatrooms[chatroomIndex],
            latestMessage: formattedMessage.content,
            latestTime: formattedMessage.createDate,
            latestSender: formattedMessage.nickname,
          };
          state.chatrooms.sort((a, b) => {
            const timeA = a.latestTime ? new Date(a.latestTime).getTime() : 0;
            const timeB = b.latestTime ? new Date(b.latestTime).getTime() : 0;
            return timeB - timeA;
          });
        }
      }
    },
    setMessages: (state, action) => {
      const { chatroomId, messages } = action.payload;
      state.messages[chatroomId] = messages;
    },
    setChatrooms: (state, action) => {
      state.chatrooms = action.payload;
    },
    updateChatroom: (state, action) => {
      const updatedChatroom = action.payload;
      const index = state.chatrooms.findIndex(room => room.id === updatedChatroom.id);
      if (index !== -1) {
        state.chatrooms[index] = { ...state.chatrooms[index], ...updatedChatroom };
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(subscribeToChat.fulfilled, (state, action) => {
      const { chatroomId, subscriptionId } = action.payload;
      state.subscriptions[chatroomId] = subscriptionId;
    })
    .addCase(updateChatroomStatus.fulfilled, (state, action) => {
      const { chatroomId, status } = action.payload;
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      if (chatroom) {
        chatroom.boardStatus = status;
      }
    })
    .addCase(sendWebSocketMessage.fulfilled, (state, action) => {
      // 메시지 전송 성공 시 아무 작업도 하지 않음
      // 웹소켓을 통해 받은 메시지로 상태를 업데이트할 것임
    });
  },
});

export const {
  webSocketConnected,
  webSocketDisconnected,
  receiveMessage,
  setMessages,
  setChatrooms,
  updateChatroom,
  updateLocalChatroom,
  addLocalMessage,
  updateMessageStatus
} = chatSlice.actions;

export default chatSlice.reducer;