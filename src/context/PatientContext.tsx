import React, { createContext, useContext, useState, ReactNode } from "react";

import { envs } from "@/envs";

import { useAuth } from "./AuthContext";

export type PatientSex = "MALE" | "FEMALE" | "OTHER";
export type PatientMaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "OTHER";

export interface PatientCreationPayload {
  gender: string;
  age: number;
  name: string;
  sex: PatientSex;
  marital_status: PatientMaritalStatus;
  profession: string;
  religion: string;
  housing: string;
  color: string;
  is_new: boolean;
  created_by: string;
}

export interface PatientData extends PatientCreationPayload {
  id: string;
  created_at: Date;
}

interface PatientContextType {
  patient?: PatientData;
  patients?: PatientData[];
  isLoading: boolean;
  setPatient: (patient: PatientData) => void;
  clearPatient: () => void;
  createPatient: (payload: PatientCreationPayload) => Promise<PatientData>;
  getPatientsByUser: (userId: string) => Promise<PatientData[]>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

interface PatientProviderProps {
  children: ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({
  children,
}) => {
  const [patient, setPatient] = useState<PatientData>();
  const [patients, setPatients] = useState<PatientData[] | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user, session } = useAuth();

  const clearPatient = () => {
    setPatient(null);
  };

  const createPatient = async (payload: PatientCreationPayload) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getPatientsByUser = async (userId: string): Promise<PatientData[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/get-patients-by-user?user_id=${userId}`,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        patients,
        isLoading,
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

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};
