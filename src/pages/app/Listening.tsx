import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";

import PatientInfo from "@/components/organisms/patient-info";
import Timer from "@/components/molecules/timer";
import ListeningControls from "@/components/organisms/listening-controls";

const ListeningPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    appointment,
    startListening,
    stopListening,
    isListening,
    isProcessing,
  } = useAppointment();
  const { patient } = usePatient();
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!patient) {
      navigate("/app/novo-atendimento");
    }
  }, [patient, navigate]);

  useEffect(() => {
    if (patient && !isListening && !isProcessing) {
      startListening();
    }
  }, [patient, isListening, isProcessing, startListening]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isListening && !isPaused) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isListening, isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleFinish = () => {
    stopListening();
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-bold">Processando áudio...</h2>
          <p className="text-gray-600">
            Estamos transcrevendo e analisando o áudio da consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-r from-ally-blue to-blue-600 rounded-3xl shadow-lg p-8 mb-8 overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Atendimento em Andamento
            </h1>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <PatientInfo name={patient?.name || ""} type={appointment.type} />
            <Timer duration={duration} />
            <ListeningControls
              isListening={isListening}
              isPaused={isPaused}
              onTogglePause={togglePause}
              onFinish={handleFinish}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
