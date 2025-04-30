
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppointment } from '@/context/AppointmentContext';

const FormatSelection: React.FC = () => {
  const navigate = useNavigate();
  const { appointment } = useAppointment();
  const [selectedFormat, setSelectedFormat] = useState('soap');
  
  // Redirecionar se não houver prontuário
  useEffect(() => {
    if (!appointment.soapNote.subjective) {
      navigate('/app/novo-atendimento');
    }
  }, [appointment, navigate]);

  const handleViewResult = () => {
    switch (selectedFormat) {
      case 'soap':
        navigate('/app/resumo');
        break;
      case 'anamnese':
        navigate('/app/resumo?format=anamnese');
        break;
      default:
        navigate('/app/resumo');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Atendimento processado com sucesso!</h1>
        <p className="text-lg text-gray-600">Como deseja visualizar o resultado?</p>
      </div>

      <div className="mb-8">
        <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat} className="space-y-4">
          {/* Formatos disponíveis */}
          <Card className={`border-2 ${selectedFormat === 'soap' ? 'border-ally-blue' : 'border-gray-200'} hover:border-ally-blue transition-colors cursor-pointer`}>
            <label htmlFor="soap" className="cursor-pointer">
              <CardContent className="flex items-center p-6">
                <RadioGroupItem value="soap" id="soap" className="mr-4" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-ally-blue" />
                    <h3 className="font-medium text-lg">SOAP (padrão)</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Formato padrão com Subjetivo, Objetivo, Avaliação e Plano
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </label>
          </Card>

          <Card className={`border-2 ${selectedFormat === 'anamnese' ? 'border-ally-blue' : 'border-gray-200'} hover:border-ally-blue transition-colors cursor-pointer`}>
            <label htmlFor="anamnese" className="cursor-pointer">
              <CardContent className="flex items-center p-6">
                <RadioGroupItem value="anamnese" id="anamnese" className="mr-4" />
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-ally-blue" />
                    <h3 className="font-medium text-lg">Anamnese Estruturada</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Formato estruturado seguindo o modelo tradicional de anamnese
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </label>
          </Card>
        </RadioGroup>
      </div>

      {/* Formatos em desenvolvimento */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-600">Outros formatos (em breve)</h3>
        <div className="space-y-3">
          {[
            'Anamnese Focada',
            'Anamnese por Especialidade',
            'Anamnese Ocupacional',
            'Revisão de Sistemas',
            'Psicossocial'
          ].map((format, index) => (
            <Card key={index} className="bg-gray-50 border-gray-200 opacity-70">
              <CardContent className="flex items-center p-4">
                <div className="flex-1">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-gray-400" />
                    <h3 className="font-medium text-gray-500">{format}</h3>
                  </div>
                </div>
                <div className="flex items-center text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Em desenvolvimento
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleViewResult} className="px-8 py-6 text-lg">
          Visualizar prontuário
        </Button>
      </div>
    </div>
  );
};

export default FormatSelection;
