import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from "axios";

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

      dispatch(addLocalMessage({ chatroomId, message }));
      dispatch(updateLocalChatroom({
        chatroomId,
        latestMessage: content,
        latestTime: now.toISOString()
      }));

      if (stompClient && stompClient.connected) {
        try {
          await stompClient.send(`/api/v1/ws/chats/${chatroomId}`, {}, JSON.stringify(message));
          dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'sent' }));
          return message;
        } catch (error) {
          dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'failed' }));
          throw error;
        }
      } else {
        dispatch(updateMessageStatus({ chatroomId, messageId: message.id, status: 'failed' }));
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
        await axios.patch('http://localhost:8080/api/v1/chatrooms/change-status', {
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
        const chatroomIndex = state.chatrooms.findIndex(room => room.id === chatroomId);
        if (chatroomIndex !== -1) {
          state.chatrooms[chatroomIndex] = {
            ...state.chatrooms[chatroomIndex],
            latestMessage: message.content,
            latestTime: message.sentTime
          };
          state.chatrooms.sort((a, b) => {
            const timeA = a.latestTime ? new Date(`1970-01-01T${a.latestTime}`) : new Date(0);
            const timeB = b.latestTime ? new Date(`1970-01-01T${b.latestTime}`) : new Date(0);
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
    updateLocalChatroom: (state, action) => {
      const { chatroomId, latestMessage, latestTime } = action.payload;
      const index = state.chatrooms.findIndex(room => room.id === chatroomId);
      if (index !== -1) {
        state.chatrooms[index] = {
          ...state.chatrooms[index],
          latestMessage,
          latestTime
        };
        state.chatrooms.sort((a, b) => {
          const timeA = a.latestTime ? new Date(a.latestTime) : new Date(0);
          const timeB = b.latestTime ? new Date(b.latestTime) : new Date(0);
          return timeB - timeA;
        });
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
    builder.addCase(updateChatroomStatus.fulfilled, (state, action) => {
      const { chatroomId, status } = action.payload;
      const chatroom = state.chatrooms.find(room => room.id === chatroomId);
      if (chatroom) {
        chatroom.boardStatus = status;
      }
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