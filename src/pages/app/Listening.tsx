import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader,
  Loader2,
  Loader2Icon,
  LoaderPinwheel,
  LucideLoader2,
  ShieldIcon,
} from "lucide-react";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";

import PatientInfo from "@/components/organisms/patient-info";
import Timer from "@/components/molecules/timer";
import ListeningControls from "@/components/organisms/listening-controls";
import { Card, CardContent } from "@/components/ui/card";
import { useTranscription } from "@/context/TranscriptionContext";

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
  }, [recordingStatus, transcription, isTranscribing, startRecording]);

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
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-r from-ally-blue to-blue-600 rounded-3xl p-8 mb-8 overflow-hidden shadow-lg shadow-black/10">
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
              onFinish={stopRecording}
            />
          </div>
        </div>
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-ally-light p-3 rounded-full">
              <ShieldIcon className="h-5 w-5 text-ally-blue" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">
                Escutando com segurança
              </h3>
              <p className="text-sm text-gray-600">
                Seus dados são criptografados e não são armazenados
                permanentemente. A Ally gera o prontuário apenas ao final da
                consulta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeningPage;
