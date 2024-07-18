export const SEND_MESSAGE = 'SEND_MESSAGE';
export const UPDATE_CHATROOM = 'UPDATE_CHATROOM';

export const sendMessage = (chatroomId, message) => ({
  type: SEND_MESSAGE,
  payload: { chatroomId, message }
});

export const updateChatroom = (chatroomId, lastMessage, lastMessageTime) => ({
  type: UPDATE_CHATROOM,
  payload: { chatroomId, lastMessage, lastMessageTime }
});