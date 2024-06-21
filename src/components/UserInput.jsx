import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 20px; /* Adds space between inputs */
  width: 80%;
  box-sizing: border-box;
`;

const UserInput = ({ type, placeholder, value, name, onChange }) => {
  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      name={name}
    />
  );
};

  export default UserInput;