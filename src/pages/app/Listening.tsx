
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { toast } from '@/components/ui/sonner';

const Listening: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, startListening, stopListening, isListening } = useAppointment();
  const [duration, setDuration] = useState(0);
  
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
    
    if (isListening) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [isListening]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleFinish = () => {
    stopListening();
    navigate('/app/resumo');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Atendimento em Andamento</CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-8 py-12">
          <div className="text-center">
            <p className="text-lg mb-2">
              Paciente: <span className="font-semibold">{appointment.patient?.name}</span>
            </p>
            <p className="text-sm text-gray-600">
              {appointment.type === 'new' ? 'Primeiro atendimento' : 'Paciente de retorno'}
            </p>
          </div>
          
          <div 
            className={`w-36 h-36 rounded-full flex items-center justify-center border-4 
              ${isListening ? 'border-green-500 animate-pulse' : 'border-gray-300'}`}
          >
            {isListening ? (
              <Mic className="w-14 h-14 text-green-500" />
            ) : (
              <MicOff className="w-14 h-14 text-gray-400" />
            )}
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-2xl font-semibold">{formatTime(duration)}</p>
            <p className="text-lg font-medium text-green-600">
              {isListening ? 'Ouvindo...' : 'Escuta pausada'}
            </p>
            <p className="text-gray-600 max-w-md mx-auto mt-2">
              A Ally está registrando a consulta. Fique à vontade para atender normalmente.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="justify-center pt-4">
          <Button 
            onClick={handleFinish}
            className="w-full sm:w-auto px-8"
            size="lg"
          >
            Encerrar Atendimento
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6 bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-500">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">Escutando com segurança.</span> Seus dados são 
          criptografados e não são armazenados permanentemente.
        </p>
      </div>
    </div>
  );
};

export default Listening;
