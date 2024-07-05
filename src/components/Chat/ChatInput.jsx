import React, { useState } from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #e0e0e0;
  padding: 10px;
  background-color: white;
  position: relative;
`;

const Input = styled.input`
  flex-grow: 1;
  border: none;
  padding: 10px;
  outline: none;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  padding: 0 10px;
  position: relative;
`;

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5em;
  padding: 0 10px;
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: #43312A;
`;



const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  return (
      <InputContainer>
        <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</EmojiButton>
        {showEmojiPicker && (
            <div style={{ position: 'absolute', bottom: '50px', left: '10px' }}>
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
        )}
        <Input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
        />
        <SendButton onClick={handleSend}>
          <StyledFontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
      </InputContainer>
  );
};

export default ChatInput;