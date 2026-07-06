import React from 'react';

const TextArea = ({ label, name, register, validation, errors, placeholder, rows = 5 }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {validation?.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name, validation)}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-colors resize-none ${
          errors?.[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500 hover:border-gray-300'
        }`}
      ></textarea>
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default TextArea;
