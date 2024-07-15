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
          dispatch(receiveMessage({
            chatroomId,
            message: {...payload, isOutgoing: payload.writerId === auth.user.id}
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
    async ({ chatroomId, content }, { getState }) => {
      if (stompClient && stompClient.connected) {
        const { auth } = getState();
        if (!auth.user || !auth.user.id) {
          throw new Error('User information not available');
        }
        const message = {
          chatroomId: parseInt(chatroomId),
          content,
          writerId: auth.user.id,
          nickname: auth.user.nickname,
          sender: auth.user.username,
          sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOutgoing: true  // 이 부분을 추가했습니다.
        };
        await stompClient.send(`/api/v1/ws/chats/${chatroomId}`, {}, JSON.stringify({...message, isOutgoing: true}));
        return message;
      } else {
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
          msg => msg.content === message.content && msg.sentTime === message.sentTime && msg.writerId === message.writerId
      );
      if (!isDuplicate) {
        state.messages[chatroomId].push({
          ...message,
          isOutgoing: message.writerId === state.auth?.user?.id, // 여기서 auth 상태에 접근할 수 없습니다.
          sender: message.nickname || message.sender
        });
      }
    },
    setMessages: (state, action) => {
      const { chatroomId, messages } = action.payload;
      state.messages[chatroomId] = messages;
    },
    setChatrooms: (state, action) => {
      state.chatrooms = action.payload;
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
  addLocalMessage
} = chatSlice.actions;

export default chatSlice.reducer;