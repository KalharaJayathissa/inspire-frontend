import React from "react";
import { ArrowRight, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RegisterButtonProps {
  label: string;
  navigateTo: string;
  className?: string;
  size?: "sm" | "lg" | "default";
  showArrow?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  icon?: "arrow" | "upload" | "document" | "none";
  onClick?: () => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  label,
  navigateTo,
  className = "",
  size = "lg",
  showArrow = false,
  variant = "primary",
  icon = "none",
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(navigateTo);
    }
  };

  // Base styles for both variants with fixed width
  const baseStyles =
    "font-semibold text-xl sm:text-2xl w-60 sm:w-72 py-6 sm:py-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center";

  // Variant-specific styles
  const variantStyles = {
    primary:
      "bg-[#2D620A] backdrop-blur-md text-white border border-green-600 hover:bg-green-800 hover:shadow-green-300/40",
    secondary:
      "bg-gradient-to-r from-blue-600/80 via-blue-700/80 to-blue-600/80 hover:from-blue-500/90 hover:via-blue-600/90 hover:to-blue-500/90 backdrop-blur-md text-white border border-blue-600 hover:shadow-blue-300/40",
    tertiary:
      "bg-gradient-to-r from-purple-600/80 via-purple-700/80 to-indigo-600/80 hover:from-purple-500/90 hover:via-purple-600/90 hover:to-indigo-500/90 backdrop-blur-md text-white border border-purple-600 hover:shadow-purple-300/40",
  };

  const renderIcon = () => {
    if (icon === "arrow" || showArrow) {
      return (
        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      );
    }
    if (icon === "upload") {
      return (
        <Upload className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
      );
    }
    if (icon === "document") {
      return (
        <FileText className="ml-3 h-5 w-5 group-hover:scale-110 transition-transform" />
      );
    }
    return null;
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {label}
      {renderIcon()}
    </Button>
  );
};

export default RegisterButton;
