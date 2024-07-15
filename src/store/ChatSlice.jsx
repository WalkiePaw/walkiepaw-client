import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = createAsyncThunk(
    'chat/connectWebSocket',
    async (_, { dispatch }) => {
      const socket = new SockJS('http://localhost:8080/ws');
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
            sentTime: payload.sentTime
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

      const now = new Date();
      const message = {
        chatroomId: parseInt(chatroomId),
        content,
        writerId: auth.user.id,
        nickname: auth.user.nickname,
        sender: auth.user.username,
        createDate: now.toISOString(),
        sentTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOutgoing: true
      };

      // 먼저 로컬에 메시지 추가
      dispatch(addLocalMessage({ chatroomId, message }));

      if (stompClient && stompClient.connected) {
        try {
          await stompClient.send(`/api/v1/ws/chats/${chatroomId}`, {}, JSON.stringify(message));
          dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'sent' }));

          // 채팅방 정보 업데이트
          dispatch(updateChatroom({
            id: chatroomId,
            latestMessage: content,
            latestTime: now.toISOString(),
          }));

          return message;
        } catch (error) {
          // 메시지 전송 실패 시 상태 업데이트
          dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'failed' }));
          throw error;
        }
      } else {
        dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'failed' }));
        throw new Error('WebSocket is not connected');
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
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      const isDuplicate = state.messages[chatroomId].some(
          msg => msg.content === message.content &&
              msg.sentTime === message.sentTime &&
              msg.writerId === message.writerId
      );
      if (!isDuplicate) {
        state.messages[chatroomId].push(message);
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
    addLocalMessage: (state, action) => {
      const { chatroomId, message } = action.payload;
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      state.messages[chatroomId].push(message);
    },
    updateMessageStatus: (state, action) => {
      const {chatroomId, messageId, status} = action.payload;
      const message = state.messages[chatroomId].find(
          msg => msg.id === messageId);
      if (message) {
        message.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(subscribeToChat.fulfilled, (state, action) => {
      const { chatroomId, subscriptionId } = action.payload;
      state.subscriptions[chatroomId] = subscriptionId;
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
  addLocalMessage,
  updateMessageStatus
} = chatSlice.actions;

export default chatSlice.reducer;