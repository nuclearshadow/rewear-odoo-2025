// components/common/LoadingSpinner.tsx
import React from "react";

type LoadingSpinnerProps = {
  size?: number; // size in pixels (default: 24)
  color?: string; // Tailwind color class (default: text-blue-600)
  className?: string;
};

/**
 * Reusable Loading Spinner
 *
 * @param size       - Width/height in pixels (default: 24)
 * @param color      - Tailwind text color class (default: text-blue-600)
 * @param className  - Additional Tailwind classes
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 24,
  color = "text-blue-600",
  className = "",
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${color} ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default LoadingSpinner;
