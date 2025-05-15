
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "primary",
  text,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const colorClasses = {
    primary: "border-t-health-primary",
    secondary: "border-t-health-secondary",
    white: "border-t-white",
  };
  
  const trackColorClasses = {
    primary: "border-health-primary/30",
    secondary: "border-health-secondary/30",
    white: "border-white/30",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${trackColorClasses[color]} animate-spinner`}
      ></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
