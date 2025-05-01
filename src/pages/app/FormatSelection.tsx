
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppointment } from '@/context/AppointmentContext';
import { ArrowLeft, CheckCircle2, Clock, FileText } from 'lucide-react';

const FormatSelection: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, setAppointment, isProcessing } = useAppointment();
  
  // Redirect if no transcription is available
  useEffect(() => {
    if (!appointment.transcription && !isProcessing) {
      navigate("/app/escuta");
    }
  }, [appointment.transcription, isProcessing, navigate]);
  
  const handleFormatSelect = (format: string) => {
    setAppointment(prev => ({
      ...prev,
      selectedFormat: format
    }));
    navigate('/app/resumo?format=' + format);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/app')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>
      
      <Card className="bg-white border-none shadow-sm mb-8">
        <CardContent className="p-8 text-center">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Atendimento processado com sucesso!</h1>
          <p className="text-gray-600 mb-6">Como deseja visualizar o resultado?</p>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-medium mb-4">Formatos disponíveis</h2>
      
      {/* Available formats */}
      <div className="grid gap-4 mb-8">
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-white border-gray-200 hover:bg-blue-50 hover:border-ally-blue"
          onClick={() => handleFormatSelect('soap')}
        >
          <div className="p-2 bg-blue-50 rounded-md">
            <FileText className="h-6 w-6 text-ally-blue" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-left">SOAP (padrão)</h3>
            <p className="text-sm text-gray-500">
              Formato padrão de registro médico: Subjetivo, Objetivo, Avaliação e Plano
            </p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-white border-gray-200 hover:bg-blue-50 hover:border-ally-blue"
          onClick={() => handleFormatSelect('anamnese')}
        >
          <div className="p-2 bg-blue-50 rounded-md">
            <FileText className="h-6 w-6 text-ally-blue" />
          </div>
          <div className="text-left">
            <h3 className="font-medium">Anamnese Estruturada</h3>
            <p className="text-sm text-gray-500">
              Formato completo com histórico médico, exames e conclusões detalhadas
            </p>
          </div>
        </Button>
      </div>
      
      <h2 className="text-lg font-medium mb-4 text-gray-500">Em desenvolvimento</h2>
      
      {/* Upcoming formats */}
      <div className="grid gap-4 opacity-70">
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-gray-50 border-gray-200 cursor-not-allowed"
          disabled
        >
          <div className="p-2 bg-gray-100 rounded-md">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium flex items-center">
              Anamnese Focada
              <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Em breve</span>
            </h3>
            <p className="text-sm text-gray-500">
              Formato resumido voltado para a queixa principal
            </p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-gray-50 border-gray-200 cursor-not-allowed"
          disabled
        >
          <div className="p-2 bg-gray-100 rounded-md">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium flex items-center">
              Anamnese por Especialidade
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Em desenvolvimento</span>
            </h3>
            <p className="text-sm text-gray-500">
              Formato adaptado para cada especialidade médica
            </p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-gray-50 border-gray-200 cursor-not-allowed"
          disabled
        >
          <div className="p-2 bg-gray-100 rounded-md">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium flex items-center">
              Anamnese Ocupacional
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Em desenvolvimento</span>
            </h3>
            <p className="text-sm text-gray-500">
              Formato específico para medicina do trabalho
            </p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-gray-50 border-gray-200 cursor-not-allowed"
          disabled
        >
          <div className="p-2 bg-gray-100 rounded-md">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium flex items-center">
              Revisão de Sistemas
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Em desenvolvimento</span>
            </h3>
            <p className="text-sm text-gray-500">
              Análise detalhada de cada sistema corporal
            </p>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 justify-start gap-4 bg-gray-50 border-gray-200 cursor-not-allowed"
          disabled
        >
          <div className="p-2 bg-gray-100 rounded-md">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-left">
            <h3 className="font-medium flex items-center">
              Psicossocial
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Em desenvolvimento</span>
            </h3>
            <p className="text-sm text-gray-500">
              Formato voltado para avaliação de aspectos psicológicos e sociais
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default FormatSelection;
