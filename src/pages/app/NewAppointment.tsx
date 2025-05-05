import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import RadioGroupItem from "@/components/molecules/radio-group-item";
import PatientSelect from "@/components/molecules/patient-select";
import PatientForm from "@/components/molecules/patient-form";

import { useToast } from "@/hooks/use-toast";
import { AppointmentType, useAppointment } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { usePatient, PatientCreationPayload } from "@/context/PatientContext";

const NewAppointment: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { appointment, isProcessing, createAppointment, setAppointment } =
    useAppointment();
  const { createPatient, getPatientsByUser, patients, setPatient } =
    usePatient();

  const [appointmentType, setAppointmentType] = useState<AppointmentType>();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const methods = useForm<PatientCreationPayload>();

  useEffect(() => {
    if (user?.id) {
      getPatientsByUser(user.id);
    }
  }, [user]);

  useEffect(() => {
    setAppointment(null);
  }, []);

  useEffect(() => {
    if (appointment && !isProcessing) {
      navigate("/app/escuta");
    }
  }, [appointment, isProcessing]);

  const startAppointmentWithPatient = async (patientId: string) => {
    try {
      const result = await createAppointment({
        doctor_id: user.id,
        patient_id: patientId,
        type: appointmentType!,
      });

      if (!result?.patient) {
        toast({ description: "Erro ao iniciar atendimento." });
        return;
      }

      setPatient(result.patient);
    } catch (error) {
      console.error("Erro ao iniciar atendimento:", error);
      toast({ description: "Erro ao iniciar atendimento." });
    }
  };

  const handleSubmitNewPatient = async (data: PatientCreationPayload) => {
    setIsWaiting(true);
    try {
      console.log("Creating patient: ", data);
      const newPatient = await createPatient({
        ...data,
        is_new: true,
        created_by: user.id,
      });

      if (!newPatient?.id) {
        toast({ description: "Erro ao criar o paciente." });
        return;
      }

      await startAppointmentWithPatient(newPatient.id);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      toast({ description: "Erro ao criar o paciente." });
    } finally {
      setIsWaiting(false);
    }
  };

  const handleStartReturnAppointment = async () => {
    if (!appointmentType || appointmentType !== "RETURN") {
      toast({ description: "Selecione o tipo de atendimento como 'Retorno'." });
      return;
    }

    if (!selectedPatientId) {
      toast({ description: "Selecione um paciente existente." });
      return;
    }

    setIsWaiting(true);
    await startAppointmentWithPatient(selectedPatientId);
    setIsWaiting(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>
      <h1 className="text-4xl md:text-6xl mt-6 font-semibold mb-2 gradient-text">
        Novo Atendimento
      </h1>

      <Card className="bg-white border-gray-100 shadow-none pt-8 mt-12">
        <CardContent className="space-y-6">
          <div className="space-y-4 mb-12">
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
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(
                      handleSubmitNewPatient,
                      (formErrors) => {
                        console.error("Validation errors:", formErrors);
                        toast({
                          title: "Formulário incompleto",
                          description: "Preencha todos os campos obrigatórios.",
                        });
                      }
                    )}
                    className="space-y-4"
                  >
                    <PatientForm />
                    <Button
                      type="submit"
                      disabled={isWaiting}
                      className="w-full bg-ally-blue hover:bg-ally-blue/90"
                      size="lg"
                    >
                      {isWaiting ? "Aguarde..." : "Iniciar atendimento"}
                    </Button>
                  </form>
                </FormProvider>
              ) : (
                <div>
                  <PatientSelect
                    patients={patients}
                    selectedPatientId={selectedPatientId}
                    onPatientChange={(e) =>
                      setSelectedPatientId(e.target.value)
                    }
                  />
                  <Button
                    disabled={!selectedPatientId || isWaiting}
                    onClick={handleStartReturnAppointment}
                    className="mt-12 w-full bg-ally-blue hover:bg-ally-blue/90"
                    size="lg"
                  >
                    {isWaiting ? "Aguarde..." : "Iniciar atendimento"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewAppointment;
