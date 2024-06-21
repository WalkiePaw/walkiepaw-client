// FormErrorMessage.jsx

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// styled components
const StyledFormErrorMessage = styled.div`
  position: absolute;
  padding-left: 5px;
  color: ${props => props.theme.color.main};
`;

// export
function FormErrorMessage({ errorMessage }) {
  return <StyledFormErrorMessage>{errorMessage}</StyledFormErrorMessage>;
}

// PropTypes
FormErrorMessage.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default FormErrorMessage;
