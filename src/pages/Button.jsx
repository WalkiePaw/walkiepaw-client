import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ text, color, children }) => {
  return (
  <button style={{ color: color }}>
    {text}
  </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};


Button.defaultProps = {
  color: "gray",
};

export default Button;