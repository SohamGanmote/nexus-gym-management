import React from 'react';

const Button = ({ children, onClick, className, style }) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`gradient-button text-white font-medium py-2 px-4 rounded-md focus:outline-none ease-in transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
