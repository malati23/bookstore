import React from 'react';

const Button = ({ children, type = 'button', loading = false, disabled = false, onClick, className = '' }) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={`px-6 py-3 font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md ${className}`}
    >
      {loading && (
        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full block"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
