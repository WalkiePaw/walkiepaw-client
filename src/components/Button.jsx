const Button = ({ text, color, children }) => {
  return (
  <button style={{ color: color }}>
    {text}
  </button>
  );
};

export default Button;