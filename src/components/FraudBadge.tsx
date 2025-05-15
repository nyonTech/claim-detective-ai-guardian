
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface FraudBadgeProps {
  isFraud: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const FraudBadge: React.FC<FraudBadgeProps> = ({ 
  isFraud, 
  className = "",
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "text-xs py-0.5 px-2",
    md: "text-sm py-1 px-3",
    lg: "text-base py-1.5 px-4",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${
        isFraud
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      } ${sizeClasses[size]} ${className}`}
    >
      {isFraud ? (
        <AlertTriangle className="h-3.5 w-3.5" />
      ) : (
        <CheckCircle className="h-3.5 w-3.5" />
      )}
      <span>{isFraud ? "Potential Fraud" : "No Fraud Detected"}</span>
    </div>
  );
};

export default FraudBadge;
