import React from "react";
import { Label } from "@/components/ui/label";

interface RadioGroupItemProps {
  id: string;
  value: string;
  label: string;
  onChange: (value: string) => void;
  selectedValue: string;
}

const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  id,
  value,
  label,
  onChange,
  selectedValue,
}) => {
  return (
    <div
      className={`flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50 ${
        selectedValue === value ? "bg-ally-blue/10 border-ally-blue/40" : ""
      }`}
      onClick={() => onChange(value)}
    >
      <input
        type="radio"
        id={id}
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
      />
      <Label htmlFor={id} className="cursor-pointer flex-1">
        {label}
      </Label>
    </div>
  );
};

export default RadioGroupItem;
