import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import RadioGroupItem from "@/components/molecules/radio-group-item";
import PatientSelect from "@/components/molecules/patient-select";
import PatientForm from "@/components/molecules/patient-form";

import { useToast } from "@/hooks/use-toast";
import { AppointmentType, useAppointment } from "@/context/AppointmentContext";
import { useAuth } from "@/context/AuthContext";
import { usePatient, PatientCreationPayload } from "@/context/PatientContext";
import { useAnalytics } from "@/hooks/use-analytics";
import { AppHeader } from "@/components/molecules/app-header";

const NewAppointment: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { trackPageView, trackButtonClick, trackEvent } = useAnalytics();

  const { appointment, isProcessing, createAppointment, setAppointment } =
    useAppointment();
  const {
    createPatient,
    getPatientsByUser,
    patients,
    isLoading: isLoadingPatients,
    setPatient,
  } = usePatient();

  const [appointmentType, setAppointmentType] = useState<AppointmentType>();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const methods = useForm<PatientCreationPayload>();

  useEffect(() => {
    trackPageView("new_appointment");
  }, []);

  useEffect(() => {
    if (user?.id && !isLoadingPatients && !patients) {
      getPatientsByUser(user.id);
    }
  }, [user, isLoadingPatients, patients]);

  useEffect(() => {
    setAppointment(null);
  }, []);

  useEffect(() => {
    if (appointment && !isProcessing) {
      trackEvent("appointment_created", {
        appointment_id: appointment.id,
        type: appointment.type,
      });
      navigate("/app/escuta");
    }
  }, [appointment, isProcessing, navigate, trackEvent]);

  const startAppointmentWithPatient = async (patientId: string) => {
    try {
      trackEvent("start_appointment_attempt", {
        patient_id: patientId,
        type: appointmentType,
      });

      const result = await createAppointment({
        doctor_id: user.id,
        patient_id: patientId,
        type: appointmentType!,
      });

      if (!result?.patient) {
        trackEvent("start_appointment_failed", {
          patient_id: patientId,
          error: "Patient data missing",
        });
        toast.error(null, "Erro ao iniciar atendimento.");
        return;
      }

      trackEvent("start_appointment_success", {
        patient_id: patientId,
        appointment_id: result.id,
      });

      setPatient(result.patient);
    } catch (error) {
      console.error("Erro ao iniciar atendimento:", error);
      trackEvent("start_appointment_error", {
        patient_id: patientId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast.error(null, "Erro ao iniciar atendimento.");
    }
  };

  const handleSubmitNewPatient = async (data: PatientCreationPayload) => {
    setIsWaiting(true);
    try {
      console.log("Creating patient: ", data);
      trackEvent("create_patient_attempt", {
        patient_data: { ...data, created_by: user.id },
      });

      const newPatient = await createPatient({
        ...data,
        is_new: true,
        created_by: user.id,
      });

      if (!newPatient?.id) {
        trackEvent("create_patient_failed", {
          error: "No patient ID returned",
        });
        toast.error(null, "Erro ao criar o paciente.");
        return;
      }

      trackEvent("create_patient_success", {
        patient_id: newPatient.id,
      });

      await startAppointmentWithPatient(newPatient.id);
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      trackEvent("create_patient_error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      toast.error(null, "Erro ao criar o paciente.");
    } finally {
      setIsWaiting(false);
    }
  };

  const handleStartReturnAppointment = async () => {
    if (!appointmentType || appointmentType !== "RETURN") {
      toast.warning(null, "Selecione o tipo de atendimento como 'Retorno'.");
      return;
    }

    if (!selectedPatientId) {
      toast.warning(null, "Selecione um paciente existente.");
      return;
    }

    setIsWaiting(true);
    await startAppointmentWithPatient(selectedPatientId);
    setIsWaiting(false);
  };

  const handleTypeChange = (value: string) => {
    const type = value as AppointmentType;
    setAppointmentType(type);
    trackEvent("appointment_type_selected", { type });
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    setSelectedPatientId(patientId);
    trackEvent("patient_selected", { patient_id: patientId });
  };

  const handleNavigateBack = () => {
    trackButtonClick("navigate_back_to_dashboard");
    navigate("/app");
  };

  const LoadingContent = () => (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-16 w-16 text-ally-blue animate-spin" />
        <h2 className="text-2xl font-bold">Preparando escuta...</h2>
        <p className="text-gray-600">Vamos iniciar a consulta em instantes.</p>
      </div>
    </div>
  );

  return (
    <div className="app-template">
      <AppHeader
        title="Novo Atendimento"
        description="Inicie um novo atendimento com um paciente."
      />

      <Card className="bg-white border-gray-100 shadow-none pt-8 mt-12">
        {isWaiting ? (
          <LoadingContent />
        ) : (
          <CardContent className="space-y-6">
            <div className="space-y-4 mb-12">
              <h3 className="text-lg font-medium">
                Qual o tipo de atendimento?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RadioGroupItem
                  id="NEW"
                  value="NEW"
                  label="Paciente Novo"
                  onChange={handleTypeChange}
                  selectedValue={appointmentType || ""}
                />
                <RadioGroupItem
                  id="RETURN"
                  value="RETURN"
                  label="Retorno de Paciente"
                  onChange={handleTypeChange}
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
                          trackEvent("patient_form_validation_error", {
                            errors: Object.keys(formErrors),
                          });
                          toast.error(
                            "Preencha todos os campos obrigatórios.",
                            "Formulário incompleto"
                          );
                        }
                      )}
                      className="space-y-4"
                    >
                      <PatientForm />
                      <Button
                        type="submit"
                        className="w-full bg-ally-blue hover:bg-ally-blue/90"
                        size="lg"
                        onClick={() =>
                          trackButtonClick("start_new_patient_appointment")
                        }
                      >
                        Iniciar atendimento
                      </Button>
                    </form>
                  </FormProvider>
                ) : (
                  <div>
                    <PatientSelect
                      patients={patients}
                      selectedPatientId={selectedPatientId}
                      onPatientChange={handlePatientChange}
                    />
                    <Button
                      disabled={!selectedPatientId || isWaiting}
                      onClick={handleStartReturnAppointment}
                      className="mt-12 w-full bg-ally-blue hover:bg-ally-blue/90"
                      size="lg"
                    >
                      Iniciar atendimento
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default NewAppointment;
