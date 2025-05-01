import React from "react";
import { LucideIcon } from "lucide-react";

interface FormatCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  disabled?: boolean;
  isComingSoon?: boolean;
}

const FormatCard: React.FC<FormatCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
  isComingSoon,
}) => {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-md border ${
        disabled
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200 hover:bg-blue-50 hover:border-ally-blue"
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={!disabled ? onClick : undefined}
    >
      <div
        className={`p-2 rounded-md ${disabled ? "bg-gray-100" : "bg-blue-50"}`}
      >
        <Icon
          className={`h-6 w-6 ${disabled ? "text-gray-400" : "text-ally-blue"}`}
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium flex items-center">
          {title}
          {isComingSoon && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Em breve
            </span>
          )}
        </h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default FormatCard;
