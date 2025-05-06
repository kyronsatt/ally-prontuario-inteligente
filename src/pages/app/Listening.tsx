import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldIcon } from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { useAnamnese } from "@/context/AnamneseContext";
import { useTranscription } from "@/context/TranscriptionContext";

import { toast } from "@/hooks/use-toast";

import PatientInfo from "@/components/organisms/patient-info";
import Timer from "@/components/molecules/timer";
import ListeningControls from "@/components/organisms/listening-controls";
import { Card, CardContent } from "@/components/ui/card";
import PreviousAnamnese from "@/components/organisms/previous-anamnese";
import AppointmentNotes from "@/components/organisms/appointment-notes";
import { Separator } from "@radix-ui/react-separator";

const ListeningPage: React.FC = () => {
  const navigate = useNavigate();
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
  const {
    previousAnamnese,
    isRetrievingAnamnese,
    retrieveLastAnamnese,
    appointmentNotes,
    setAppointmentNotes,
  } = useAnamnese();

  useEffect(() => {
    if (!appointment || !patient) {
      navigate("/app/novo-atendimento");
    }
  }, [patient, appointment, navigate]);

  useEffect(() => {
    if (recordingStatus === "NOT_STARTED" && !isTranscribing) {
      startRecording();
    } else if (recordingStatus === "STOPPED" && transcription) {
      navigate("/app/resumo");
    }
  }, [recordingStatus, transcription, isTranscribing]);

  useEffect(() => {
    const fetchAnamneseIfReturn = async () => {
      if (appointment?.type === "RETURN" && patient?.id) {
        try {
          await retrieveLastAnamnese(patient.id);
        } catch (error) {
          console.error("Erro ao buscar a última anamnese:", error);
          toast({
            title: "Erro ao buscar última anamnese do pacinete",
            description:
              "Isso não impede que o prosseguimento da consulta. Em um momento oportuno, notifique ao suporte.",
          });
        }
      }
    };

    fetchAnamneseIfReturn();
  }, [appointment?.type, patient?.id]);

  const handleStopRecording = async () => {
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
    <div className="w-full max-w-full h-full max-h-[100vh]">
      <div className="grid grid-cols-10 gap-4 h-full">
        <div className="col-span-6 flex flex-col gap-10 max-h-[100vh] overflow-y-auto pr-2">
          <PreviousAnamnese
            anamnese={previousAnamnese}
            isLoading={isRetrievingAnamnese}
          />
          <AppointmentNotes
            notes={appointmentNotes}
            setNotes={setAppointmentNotes}
          />
        </div>

        <div className="col-span-4 h-full">
          <div className="relative bg-gradient-to-br from-ally-blue to-[#00e6e6] rounded-xl pt-8 px-4 h-full overflow-hidden shadow-lg shadow-black/10">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="h-full flex flex-col">
                <div className="text-center mt-6 mb-16 px-4">
                  <h1 className="text-3xl font-extrabold text-white mb-1">
                    Escutando Consulta
                  </h1>
                  <PatientInfo
                    name={patient?.name || ""}
                    type={appointment?.type}
                  />
                </div>
                <div className="flex flex-col items-center justify-center gap-20 h-full">
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
              </div>
              <div className="mt-8">
                <Card className="bg-transparent border-none shadow-none">
                  <CardContent className="p-6 flex justify-center">
                    <div className="flex items-start space-x-4">
                      <div className="bg-ally-light/0 px-2 rounded-full">
                        <ShieldIcon className="h-12 w-12 text-white/50" />
                      </div>
                      <div>
                        <h3 className="text-lg text-white font-medium mb-1">
                          Escutando com segurança
                        </h3>
                        <p className="text-sm text-white/70">
                          A gravação não será armazenada e todos os dados são
                          movimentados e armazendo sob criptografia.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
