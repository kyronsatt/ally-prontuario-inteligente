import React, { createContext, useContext, useState } from "react";
import { envs } from "@/envs";

import { useAuth } from "./AuthContext";
import { PatientData } from "./PatientContext";

export type AppointmentType = "NEW" | "RETURN";

interface IAppointmentCreationPayload {
  patient_id: string;
  doctor_id: string;
  type: AppointmentType;
}

export interface AppointmentData extends IAppointmentCreationPayload {
  id: string;
  created_at: string;
  date?: Date;
  patient?: PatientData;
  patients?: Array<PatientData>;
}

interface AppointmentContextType {
  appointment?: AppointmentData;
  isProcessing: boolean;
  setAppointment: React.Dispatch<
    React.SetStateAction<AppointmentData | undefined>
  >;
  createAppointment: (
    payload: IAppointmentCreationPayload
  ) => Promise<AppointmentData>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointment, setAppointment] = useState<AppointmentData>();
  const { session } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const createAppointment = async (payload: IAppointmentCreationPayload) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `${envs.SUPABASE_HOST}/functions/v1/create-appointment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating appointment");
      }

      const appointment = (await response.json()) as AppointmentData;
      setAppointment(appointment);

      return appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointment,
        isProcessing,
        setAppointment,
        createAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const ctx = useContext(AppointmentContext);
  if (!ctx)
    throw new Error("useAppointment must be used within AppointmentProvider");
  return ctx;
};
