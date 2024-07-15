import { SEND_MESSAGE, UPDATE_CHATROOM } from '../../store/actions/ChatActions.jsx';

const initialState = {
  messages: {},
  chatrooms: []
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatroomId]: [
            ...(state.messages[action.payload.chatroomId] || []),
            action.payload.message
          ]
        }
      };
    case UPDATE_CHATROOM:
      return {
        ...state,
        chatrooms: state.chatrooms.map(chatroom =>
            chatroom.id === action.payload.chatroomId
                ? {
                  ...chatroom,
                  latestMessage: action.payload.lastMessage,
                  latestTime: action.payload.lastMessageTime
                }
                : chatroom
        )
      };
    default:
      return state;
  }
};

export default chatReducer;