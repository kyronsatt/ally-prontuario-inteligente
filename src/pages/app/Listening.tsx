
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldIcon } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { useAnamnese } from "@/context/AnamneseContext";
import { useTranscription } from "@/context/TranscriptionContext";

import PatientInfo from "@/components/organisms/patient-info";
import Timer from "@/components/molecules/timer";
import ListeningControls from "@/components/organisms/listening-controls";
import { Card, CardContent } from "@/components/ui/card";
import PreviousAnamnese from "@/components/organisms/previous-anamnese";
import ConsultationNotes from "@/components/organisms/consultation-notes";

const ListeningPage: React.FC = () => {
  const navigate = useNavigate();
  const [consultationNotes, setConsultationNotes] = useState("");

  const { appointment } = useAppointment();
  const {
    startRecording,
    stopRecording,
    pauseRecording,
    duration,
    recordingStatus,
    isTranscribing,
    transcription,
  } = useTranscription();
  const { patient } = usePatient();
  const { anamnese: previousAnamnese, isRetrievingAnamnese } = useAnamnese();

  useEffect(() => {
    if (!appointment || !patient) {
      navigate("/app/novo-atendimento");
    }
  }, [patient, appointment, navigate]);

  useEffect(() => {
    if (recordingStatus === "NOT_STARTED" && !isTranscribing) {
      startRecording();
    } else if (recordingStatus === "STOPPED" && transcription) {
      // Pass consultation notes to the next screen or context
      navigate("/app/resumo");
    }
  }, [recordingStatus, transcription, isTranscribing, startRecording]);

  const handleStopRecording = async () => {
    // Store consultation notes in localStorage or context for use in generating the report
    localStorage.setItem("consultationNotes", consultationNotes);
    await stopRecording();
  };

  if (isTranscribing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-16 w-16 text-ally-blue animate-spin" />
          <h2 className="text-2xl font-bold">Processando áudio...</h2>
          <p className="text-gray-600">
            Estamos transcrevendo e analisando o áudio da consulta.
          </p>
          <p className="text-gray-500 text-sm">
            Isso pode levar alguns instantes. Por favor, aguarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full h-full">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
        {/* Left Column - Previous Medical Report */}
        <div className="col-span-3">
          <PreviousAnamnese 
            anamnese={previousAnamnese} 
            isLoading={isRetrievingAnamnese} 
          />
        </div>

        {/* Center Column - Consultation Controls */}
        <div className="col-span-6">
          <div className="relative bg-gradient-to-br from-ally-blue to-[#00e6e6] rounded-3xl p-8 h-full overflow-hidden shadow-lg shadow-black/10">
            <div className="relative z-10">
              <div className="text-center my-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Atendimento em Andamento
                </h1>
              </div>
              <div className="flex flex-col items-center space-y-10">
                <PatientInfo name={patient?.name || ""} type={appointment.type} />
                <Timer
                  duration={duration}
                  isPaused={recordingStatus === "PAUSED"}
                />
                <ListeningControls
                  recordingStatus={recordingStatus}
                  onTogglePause={pauseRecording}
                  onFinish={handleStopRecording}
                />
              </div>

              <div className="mt-8">
                <Card className="border-ally-blue/30 bg-ally-blue/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-ally-light p-3 rounded-full">
                        <ShieldIcon className="h-5 w-5 text-ally-blue" />
                      </div>
                      <div>
                        <h3 className="text-lg text-ally-blue font-medium mb-1">
                          Escutando com segurança
                        </h3>
                        <p className="text-sm text-gray-500">
                          Seus dados são criptografados e não são armazenados
                          permanentemente. A Ally gera o prontuário apenas ao final da
                          consulta.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Notes */}
        <div className="col-span-3">
          <ConsultationNotes 
            notes={consultationNotes} 
            setNotes={setConsultationNotes} 
          />
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
