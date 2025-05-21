
import React from "react";
import PatientInfo from "@/components/molecules/patient-info";

interface PatientInfoContainerProps {
  name: string;
  type: "NEW" | "RETURN";
  className?: string;
}

const PatientInfoContainer: React.FC<PatientInfoContainerProps> = (props) => {
  return <PatientInfo {...props} />;
};

export default PatientInfoContainer;
