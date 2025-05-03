import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RadioGroupItem from "@/components/molecules/radio-group-item";
import PatientForm from "@/components/molecules/patient-form";
import PatientSelect from "@/components/molecules/patient-select";

import { useToast } from "@/hooks/use-toast";
import { AppointmentType, useAppointment } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { PatientGender, usePatient } from "@/context/PatientContext";

const NewAppointment: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { appointment, isProcessing, createAppointment } = useAppointment();
  const { createPatient, getPatientsByUser, patients, setPatient } =
    usePatient();

  const [appointmentType, setAppointmentType] = useState<AppointmentType>();
  const [patientName, setPatientName] = useState<string>("");
  const [patientAge, setPatientAge] = useState<string>("");
  const [patientGender, setPatientGender] = useState<PatientGender>("MALE");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  useEffect(() => {
    if (user?.id) {
      getPatientsByUser(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (appointment && !isProcessing) {
      console.log(
        "Appointment created with success. Redirecting for listening: ",
        appointment
      );
      navigate("/app/escuta");
    }
  }, [appointment, isProcessing]);

  const validateAppointmentType = (): boolean => {
    if (!appointmentType) {
      toast({ description: "Por favor, selecione o tipo de atendimento." });
      return false;
    }
    return true;
  };

  const validateNewPatientData = (): boolean => {
    if (!patientName || !patientAge) {
      toast({
        description: "Por favor, preencha todas as informações do paciente.",
      });
      return false;
    }
    return true;
  };

  const createNewPatient = async (): Promise<string | null> => {
    try {
      const createdPatient = await createPatient({
        gender: patientGender,
        age: parseInt(patientAge, 10),
        name: patientName,
        is_new: true,
        created_by: user.id,
      });

      if (!createdPatient) {
        toast({ description: "Erro ao criar o paciente. Tente novamente." });
        return null;
      }

      return createdPatient.id;
    } catch (error) {
      console.error("Erro ao criar o paciente:", error);
      toast({ description: "Erro ao criar o paciente. Tente novamente." });
      return null;
    }
  };

  const startAppointment = async () => {
    if (!validateAppointmentType()) return;

    let patientId = selectedPatientId;

    if (appointmentType === "NEW") {
      if (!validateNewPatientData()) return;

      const newPatientId = await createNewPatient();
      if (!newPatientId) return;

      patientId = newPatientId;
    }

    if (!patientId) {
      toast({
        description:
          "Paciente não encontrado. Por favor, selecione ou crie um paciente.",
      });
      return;
    }

    await createNewAppointment(patientId);
  };

  const createNewAppointment = async (patientId: string): Promise<boolean> => {
    try {
      const appointment = await createAppointment({
        doctor_id: user.id,
        patient_id: patientId,
        type: appointmentType,
      });

      if (!appointment || !appointment.patient) {
        toast({ description: "Erro ao criar o atendimento. Tente novamente." });
        return false;
      }

      setPatient(appointment.patient);
    } catch (error) {
      console.error("Erro ao criar o atendimento:", error);
      toast({
        description: "Ocorreu um erro ao criar o atendimento. Tente novamente.",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Novo Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Qual o tipo de atendimento?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RadioGroupItem
                id="NEW"
                value="NEW"
                label="Paciente Novo"
                onChange={(value) =>
                  setAppointmentType(value as AppointmentType)
                }
                selectedValue={appointmentType || ""}
              />
              <RadioGroupItem
                id="RETURN"
                value="RETURN"
                label="Retorno de Paciente"
                onChange={(value) =>
                  setAppointmentType(value as AppointmentType)
                }
                selectedValue={appointmentType || ""}
              />
            </div>
          </div>

          {appointmentType && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">
                {appointmentType === "NEW"
                  ? "Informações do novo paciente"
                  : "Buscar paciente"}
              </h3>
              {appointmentType === "NEW" ? (
                <PatientForm
                  patientName={patientName}
                  patientAge={patientAge}
                  patientGender={patientGender}
                  onNameChange={(e) => setPatientName(e.target.value)}
                  onAgeChange={(e) => setPatientAge(e.target.value)}
                  onGenderChange={(e) =>
                    setPatientGender(e.target.value as PatientGender)
                  }
                />
              ) : (
                <PatientSelect
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                  onPatientChange={(e) => setSelectedPatientId(e.target.value)}
                />
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-end pt-4">
          <Button
            disabled={
              !appointmentType ||
              (appointmentType === "NEW" && !patientName) || // TODO -> REVIEW THIS WHEN OPTIMIZING PATIENT ID
              (appointmentType === "RETURN" && !selectedPatientId)
            }
            onClick={startAppointment}
            className="w-full sm:w-auto bg-ally-blue hover:bg-ally-blue/90"
            size="lg"
          >
            Iniciar Escuta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewAppointment;
