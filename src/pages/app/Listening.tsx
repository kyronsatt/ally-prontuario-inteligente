import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldIcon } from "lucide-react";

import { AppointmentType, useAppointment } from "@/context/AppointmentContext";
import { usePatient } from "@/context/PatientContext";
import { useAnamnese } from "@/context/AnamneseContext";
import {
  RecordingStatus,
  useTranscription,
} from "@/context/TranscriptionContext";

import { toast } from "@/hooks/use-toast";

import PatientInfo from "@/components/organisms/patient-info";
import Timer from "@/components/molecules/timer";
import ListeningControls from "@/components/organisms/listening-controls";
import { Card, CardContent } from "@/components/ui/card";
import PreviousAnamnese from "@/components/organisms/previous-anamnese";
import AppointmentNotes from "@/components/organisms/appointment-notes";
import { useIsMobile } from "@/hooks/use-mobile";
import { IAnamnese } from "@/types";

const AuxPanels: React.FC<{
  previousAnamnese: IAnamnese;
  isRetrievingAnamnese: boolean;
  appointmentNotes: string;
  setAppointmentNotes: (val: string) => void;
}> = ({
  previousAnamnese,
  isRetrievingAnamnese,
  appointmentNotes,
  setAppointmentNotes,
}) => (
  <div className="w-full lg:w-[60%] flex flex-col h-full">
    <div className="h-full min-h-[65%] mb-5 overflow-clip">
      <PreviousAnamnese
        anamnese={previousAnamnese}
        isLoading={isRetrievingAnamnese}
      />
    </div>
    <div className="h-fit min-h-[30%] overflow-clip">
      <AppointmentNotes
        notes={appointmentNotes}
        setNotes={setAppointmentNotes}
      />
    </div>
  </div>
);
const ListeningPanel: React.FC<{
  patientName: string;
  appointmentType?: AppointmentType;
  duration: number;
  recordingStatus: RecordingStatus;
  pauseRecording: () => void;
  handleStopRecording: () => void;
}> = ({
  patientName,
  appointmentType,
  duration,
  recordingStatus,
  pauseRecording,
  handleStopRecording,
}) => (
  <div className="w-full lg:min-w-[30%] max-w-lg h-full">
    <div className="relative bg-gradient-to-br from-ally-blue to-[#00e6e6] rounded-xl px-4 h-full w-full overflow-y-auto overflow-x-clip shadow-lg shadow-black/10">
      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        <div className="w-full h-full flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-md xl:text-2xl 2xl:text-4xl font-extrabold text-white pt-5 pb-4 xl:pt-6 2xl:py-8 border-b border-white/20">
              Escutando Consulta
            </h1>
            <PatientInfo name={patientName} type={appointmentType} />
          </div>
          <div className="flex flex-col items-center justify-around gap-10 h-full">
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
        <div className="mt-8 border-t border-white/20">
          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="pt-4 px-2 flex justify-center">
              <div className="flex items-start space-x-4">
                <div className="bg-ally-light/0 rounded-full pt-1">
                  <ShieldIcon className="h-5 xl:h-6 w-5 xl:w-6 text-white/50" />
                </div>
                <div>
                  <h3 className="text-sm xl:text-md 2xl:text-lg text-white font-medium mb-1">
                    Escutando com segurança
                  </h3>
                  <p className="text-xs 2xl:text-md text-white/70">
                    A gravação não será armazenada e todos os dados são
                    movimentados e armazenados sob criptografia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);

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

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!appointment || !patient) {
      navigate("/app/novo-atendimento");
    }
  }, [patient, appointment]);

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
              "Isso não impede o prosseguimento da consulta. Em um momento oportuno, notifique o suporte.",
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

  if (isMobile) {
    return (
      <div className="w-full max-w-full h-full pb-5 overflow-y-auto">
        <div className="flex flex-col-reverse gap-8 px-2 pt-4">
          <AuxPanels
            previousAnamnese={previousAnamnese}
            isRetrievingAnamnese={isRetrievingAnamnese}
            appointmentNotes={appointmentNotes}
            setAppointmentNotes={setAppointmentNotes}
          />
          <ListeningPanel
            patientName={patient?.name || ""}
            appointmentType={appointment?.type}
            duration={duration}
            recordingStatus={recordingStatus}
            pauseRecording={pauseRecording}
            handleStopRecording={handleStopRecording}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full h-full p-8 overflow-y-auto">
      <div className="flex flex-row gap-4 h-full max-h-[70vh] sm:max-h-[80vh] md:max-h-full">
        <ListeningPanel
          patientName={patient?.name || ""}
          appointmentType={appointment?.type}
          duration={duration}
          recordingStatus={recordingStatus}
          pauseRecording={pauseRecording}
          handleStopRecording={handleStopRecording}
        />
        <AuxPanels
          previousAnamnese={previousAnamnese}
          isRetrievingAnamnese={isRetrievingAnamnese}
          appointmentNotes={appointmentNotes}
          setAppointmentNotes={setAppointmentNotes}
        />
      </div>
    </div>
  );
};

export default ListeningPage;
