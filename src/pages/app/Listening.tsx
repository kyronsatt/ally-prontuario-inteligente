
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Clock, PauseCircle } from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { toast } from '@/components/ui/sonner';

const Listening: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, startListening, stopListening, isListening } = useAppointment();
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Redirecionar se não houver paciente selecionado
  useEffect(() => {
    if (!appointment.patient) {
      navigate('/app/novo-atendimento');
    } else {
      startListening();
      toast('Escuta iniciada', {
        description: 'A Ally está ouvindo sua consulta com segurança.'
      });
    }
  }, [appointment.patient, navigate, startListening]);
  
  // Simular um cronômetro para a duração da consulta
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isListening && !isPaused) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isListening, isPaused]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleFinish = () => {
    stopListening();
    navigate('/app/formato');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      toast('Escuta retomada', {
        description: 'A Ally voltou a registrar sua consulta.'
      });
    } else {
      toast('Escuta pausada', {
        description: 'A Ally pausou o registro da consulta temporariamente.'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-r from-ally-blue to-blue-600 rounded-3xl shadow-lg p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Atendimento em Andamento</h1>
            <p className="text-white/80">
              A Ally está ouvindo e processando sua consulta com segurança.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-8">
            <div className="flex justify-between items-center w-full max-w-md">
              <div className="text-white">
                <p className="text-lg font-medium">Paciente:</p>
                <p className="text-2xl font-bold">{appointment.patient?.name}</p>
                <p className="text-sm mt-1 opacity-75">
                  {appointment.type === 'new' ? 'Primeiro atendimento' : 'Paciente de retorno'}
                </p>
              </div>
              
              <div className="bg-white/20 px-4 py-3 rounded-lg backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-white" />
                  <span className="text-xl font-bold text-white">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            <div 
              className={`w-36 h-36 rounded-full flex items-center justify-center border-4 bg-white/20 backdrop-blur-md
                ${isListening && !isPaused ? 'border-white animate-pulse' : 'border-white/50'}`}
            >
              {isListening && !isPaused ? (
                <Mic className="w-14 h-14 text-white" />
              ) : (
                <MicOff className="w-14 h-14 text-white/70" />
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={togglePause}
                className={`px-6 py-6 rounded-full ${isPaused 
                  ? "bg-white text-ally-blue hover:bg-white/90" 
                  : "bg-white/20 text-white border border-white/50 hover:bg-white/30"}`}
                size="lg"
              >
                {isPaused ? (
                  <div className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <span>Retomar</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <PauseCircle className="h-5 w-5" />
                    <span>Pausar</span>
                  </div>
                )}
              </Button>
              
              <Button 
                onClick={handleFinish}
                className="bg-white text-ally-blue hover:bg-white/90 px-6 py-6 rounded-full"
                size="lg"
              >
                Finalizar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Formas decorativas */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/30 rounded-full -ml-32 -mb-32 blur-2xl"></div>
      </div>
      
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-ally-light p-3 rounded-full">
              <Mic className="h-5 w-5 text-ally-blue" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Escutando com segurança</h3>
              <p className="text-sm text-gray-600">
                Seus dados são criptografados e não são armazenados permanentemente. 
                A Ally gera o prontuário apenas ao final da consulta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Listening;
