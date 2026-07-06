import React from 'react';

const Checkbox = ({ label, name, register, validation, description }) => {
  return (
    <div className="w-full flex items-start gap-3">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          {...register(name, validation)}
          className="w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default Checkbox;
