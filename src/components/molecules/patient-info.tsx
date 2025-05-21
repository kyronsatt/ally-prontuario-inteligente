
import React from "react";
import { cn } from "@/lib/utils";
import PatientTypeTag from "@/components/atoms/patient-type-tag";

interface PatientInfoProps {
  name: string;
  type: "NEW" | "RETURN";
  className?: string;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ name, type, className }) => {
  return (
    <div
      className={cn(
        "text-white w-full flex flex-col gap-1 my-5 justify-center items-center",
        className
      )}
    >
      <p className="text-md font-medium">{name}</p>
      <PatientTypeTag type={type} />
    </div>
  );
};

export default PatientInfo;
