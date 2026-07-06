import React from 'react';

const Select = ({ label, name, options, register, validation, errors, placeholder }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {validation?.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        {...register(name, validation)}
        className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
          errors?.[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-pink-500 hover:border-gray-300'
        }`}
        defaultValue=""
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );
};

export default Select;
