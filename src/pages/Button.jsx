const Button = ({ text, color, children }) => {
  return (
  <button style={{ color: color }}>
    {text}
  </button>
  );
};

Button.defaultProps = {
  color: "black",
};

export default Button;