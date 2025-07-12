// components/common/Input.tsx
"use client";

import React from "react";

type InputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Reusable Input component
 * 
 * @param name         - Name of the input field (used for formData keys)
 * @param value        - Current value of the input field
 * @param onChange     - Function to call when value changes
 * @param label        - Optional label to show above the input
 * @param type         - HTML input type (e.g., text, email, password)
 * @param placeholder  - Placeholder text inside the input
 * @param required     - If true, adds required attribute
 * @param disabled     - If true, disables the input
 * @param className    - Extra classes to pass for customization
 */
const Input: React.FC<InputProps> = ({
  name,
  value,
  onChange,
  label,
  type = "text",
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${className}`}
      />
    </div>
  );
};

export default Input;
