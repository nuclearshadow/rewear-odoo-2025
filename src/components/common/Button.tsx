// components/common/Button.tsx
"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "outline";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

/**
 * Reusable Button component
 *
 * @param children   - The button content (text or icons)
 * @param onClick    - Click handler function
 * @param type       - Button type (default: "button")
 * @param variant    - Style variant: primary | secondary | danger | outline
 * @param disabled   - If true, disables the button
 * @param loading    - If true, shows a loading spinner
 * @param className  - Additional Tailwind CSS classes
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}) => {
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = "bg-blue-600 hover:bg-blue-700 text-white";
      break;
    case "secondary":
      variantClasses = "bg-gray-600 hover:bg-gray-700 text-white";
      break;
    case "danger":
      variantClasses = "bg-red-600 hover:bg-red-700 text-white";
      break;
    case "outline":
      variantClasses = "border border-gray-500 text-gray-700 hover:bg-gray-100";
      break;
    default:
      variantClasses = "bg-blue-600 hover:bg-blue-700 text-white";
  }

  const disabledClasses = disabled || loading ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-4 py-2 rounded-md font-medium transition duration-200 focus:outline-none ${variantClasses} ${disabledClasses} ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
