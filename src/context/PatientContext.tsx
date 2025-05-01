import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext"; // Assuming you have an AuthContext to get the user ID

export type PatientGender = "MALE" | "FEMALE" | "OTHER";
// Define the payload for creating a patient
interface PatientCreationPayload {
  gender: PatientGender;
  age: number;
  name: string;
  is_new: boolean;
  created_by: string;
}

export interface PatientData extends PatientCreationPayload {
  id: string;
  created_at: Date;
}

// Define the context value type
interface PatientContextType {
  patient?: PatientData;
  patients?: PatientData[];
  setPatient: (patient: PatientData) => void;
  clearPatient: () => void;
  createPatient: (payload: PatientCreationPayload) => Promise<PatientData>;
  getPatientsByUser: (userId: string) => Promise<PatientData[]>;
}

// Create the context with a default value
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Create a provider component
interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({
  children,
}) => {
  const [patient, setPatient] = useState<PatientData>();
  const [patients, setPatients] = useState<PatientData[]>([]); // State to store the list of patients
  const { user, session } = useAuth();

  const clearPatient = () => {
    setPatient(null);
  };

  const createPatient = async (payload: PatientCreationPayload) => {
    try {
      const response = await fetch(
        "https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/create-patient",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            created_by: user?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating patient:", errorData.error);
        throw new Error(errorData.error);
      }

      const patientData = (await response.json()) as PatientData;
      console.log("Patient created successfully:", patientData);
      setPatient(patientData);

      return patientData;
    } catch (error) {
      console.error("Failed to create patient:", error);
    }
  };

  const getPatientsByUser = async (userId: string): Promise<PatientData[]> => {
    try {
      const response = await fetch(
        `https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/get-patients-by-user?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching patients:", errorData.error);
        throw new Error(errorData.error);
      }

      const patientsData = (await response.json()) as PatientData[];
      console.log("Patients retrieved successfully:", patientsData);
      setPatients(patientsData);

      return patientsData;
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return [];
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        patients,
        setPatient,
        clearPatient,
        createPatient,
        getPatientsByUser,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Custom hook to use the PatientContext
export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
