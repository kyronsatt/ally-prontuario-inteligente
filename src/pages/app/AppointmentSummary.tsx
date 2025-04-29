
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Check } from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { toast } from '@/components/ui/sonner';

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, resetAppointment } = useAppointment();
  
  // Redirecionar se não houver dados do SOAP
  useEffect(() => {
    if (!appointment.patient || !appointment.soapNote.subjective) {
      navigate('/app/novo-atendimento');
    }
  }, [appointment, navigate]);
  
  const handleExportPDF = () => {
    toast.success('PDF gerado com sucesso', {
      description: 'O documento foi preparado para download.'
    });
    // Em uma aplicação real, aqui teríamos a lógica de exportar para PDF
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleFinish = () => {
    toast.success('Atendimento registrado com sucesso');
    resetAppointment();
    navigate('/app');
  };

  if (!appointment.patient) {
    return null; // Evita renderização antes do redirecionamento
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Resumo do Atendimento</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Informações do Paciente</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <p><span className="font-medium">Nome:</span> {appointment.patient.name}</p>
              {appointment.patient.age && (
                <p><span className="font-medium">Idade:</span> {appointment.patient.age} anos</p>
              )}
              <p>
                <span className="font-medium">Tipo:</span> {appointment.type === 'new' ? 'Primeiro atendimento' : 'Retorno'}
              </p>
              <p>
                <span className="font-medium">Data:</span> {appointment.date?.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Prontuário SOAP</h3>
            
            <div className="space-y-5">
              <div>
                <h4 className="font-medium text-ally-blue mb-1">S: Subjetivo</h4>
                <p className="bg-gray-50 p-3 rounded-md">{appointment.soapNote.subjective}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-ally-blue mb-1">O: Objetivo</h4>
                <p className="bg-gray-50 p-3 rounded-md">{appointment.soapNote.objective}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-ally-blue mb-1">A: Avaliação</h4>
                <p className="bg-gray-50 p-3 rounded-md">{appointment.soapNote.assessment}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-ally-blue mb-1">P: Plano</h4>
                <p className="bg-gray-50 p-3 rounded-md">{appointment.soapNote.plan}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="justify-between flex-wrap gap-3 pt-4">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </div>
          
          <Button 
            onClick={handleFinish}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Salvar e Concluir
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AppointmentSummary;
