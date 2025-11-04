import React, { InputHTMLAttributes } from 'react';

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input className="input" {...props} />;
};

export default Input;
