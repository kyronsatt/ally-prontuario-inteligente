import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

export type AppointmentType = "NEW" | "RETURN";

interface IAppointmentCreationPayload {
  patient_id: string;
  doctor_id: string;
  type: AppointmentType;
}
interface AppointmentData extends IAppointmentCreationPayload {
  id: string;
  created_at: Date;
}

interface AppointmentContextType {
  appointment: AppointmentData;
  setAppointment: React.Dispatch<React.SetStateAction<AppointmentData>>;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetAppointment: () => void;
  createAppointment: (
    appointmentCreationPayload: IAppointmentCreationPayload
  ) => Promise<AppointmentData>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appointment, setAppointment] = useState<AppointmentData>();
  const [isListening, setIsListening] = useState(false);
  const { session } = useAuth();

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
    // Simulação de dados do SOAP para demonstração
    setAppointment((prev) => ({
      ...prev,
      date: new Date(),
    }));
  };

  const resetAppointment = () => {
    setAppointment(defaultAppointment);
    setIsListening(false);
  };

  const createAppointment = async (
    appointmentCreationPayload: IAppointmentCreationPayload
  ) => {
    const response = await fetch(
      "https://qvcdczmigjsvrxmiryos.supabase.co/functions/v1/create-appointment",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentCreationPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error creating appointment:", errorData.error);
    } else {
      const appointmentData = (await response.json()) as AppointmentData;
      console.log("Appointment created successfully:", appointmentData);
      setAppointment(appointmentData);

      return appointmentData;
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointment,
        setAppointment,
        isListening,
        startListening,
        stopListening,
        resetAppointment,
        createAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointment must be used within an AppointmentProvider"
    );
  }
  return context;
};
