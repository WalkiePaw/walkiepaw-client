import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const StatusButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: ${props => props.isBoardWriter ? 'pointer' : 'default'};
  margin-left: 10px;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);

  &:hover {
    box-shadow: ${props => props.isBoardWriter ? '0 4px 8px rgba(0,0,0,0.15)' : '0 2px 5px rgba(0,0,0,0.1)'};
  }
`;

const DropdownContent = styled(motion.div)`
  position: absolute;
  background-color: white;
  min-width: 150px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 10px;
  overflow: hidden;
  z-index: 1;
  top: 100%;
  right: 0;
  margin-top: 5px;
`;

const DropdownItem = styled(motion.div)`
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f8f8;
  }
`;

const statusColors = {
  RECRUITING: '#4CAF50',
  RESERVED: '#FFC107',
  COMPLETED: '#2196F3',
  DELETED: '#F44336'
};

const statusTranslations = {
  RECRUITING: "모집 중",
  RESERVED: "예약 중",
  COMPLETED: "완료",
  DELETED: "삭제"
};

const BoardStatusDropdown = ({ status, isBoardWriter: boardWriter, chatroomId, onStatusChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!boardWriter || newStatus === 'DELETED') return;
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
      <div style={{ position: 'relative' }}>
        <StatusButton
            color={statusColors[status]}
            onClick={() => boardWriter && setIsOpen(!isOpen)}
            isBoardWriter={boardWriter}
            whileHover={boardWriter ? { scale: 1.03 } : {}}
            whileTap={boardWriter ? { scale: 0.97 } : {}}
        >
          {statusTranslations[status]}
          {boardWriter && <FontAwesomeIcon icon={faChevronDown} style={{ marginLeft: '8px' }} />}
        </StatusButton>
        <AnimatePresence>
          {isOpen && boardWriter && (
              <DropdownContent
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
              >
                {Object.entries(statusTranslations)
                .filter(([key]) => key !== 'DELETED') // 'DELETED' 옵션 제거
                .map(([key, value]) => (
                    <DropdownItem
                        key={key}
                        onClick={() => handleStatusChange(key)}
                        whileHover={{ backgroundColor: '#f1f1f1' }}
                    >
                      {value}
                    </DropdownItem>
                ))}
              </DropdownContent>
          )}
        </AnimatePresence>
      </div>
  );
};

export default BoardStatusDropdown;