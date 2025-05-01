
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, isProcessing } = useAppointment();
  const [searchParams] = useSearchParams();
  const [viewFormat, setViewFormat] = useState<string>('soap');

  // Get format from URL or context
  useEffect(() => {
    const formatParam = searchParams.get('format');
    if (formatParam) {
      setViewFormat(formatParam);
    } else if (appointment.selectedFormat) {
      setViewFormat(appointment.selectedFormat);
    }
  }, [searchParams, appointment.selectedFormat]);

  // Redirect if no report is available
  useEffect(() => {
    if (!isProcessing && (!appointment.soapNote || !appointment.anamneseNote)) {
      navigate('/app/novo-atendimento');
    }
  }, [appointment, isProcessing, navigate]);

  // Format date
  const formattedDate = appointment.date
    ? format(appointment.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : '';

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-16 w-16 text-ally-blue animate-spin" />
          <h2 className="text-2xl font-bold">Finalizando relatório médico...</h2>
          <p className="text-gray-600">
            Quase pronto! Estamos finalizando o relatório da sua consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resumo do Atendimento</h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/app/historico')} variant="outline">
            Ver histórico
          </Button>
          <Button onClick={() => navigate('/app/novo-atendimento')} className="bg-ally-blue hover:bg-ally-blue/90">
            Novo atendimento
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paciente</p>
              <h2 className="text-2xl font-semibold">{appointment.patient?.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Data do atendimento</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-6 flex gap-3">
        <Button 
          variant={viewFormat === 'soap' ? "default" : "outline"} 
          onClick={() => setViewFormat('soap')}
          className={viewFormat === 'soap' ? 'bg-ally-blue hover:bg-ally-blue/90' : 'border-gray-300'}
        >
          <FileText className="mr-2 h-4 w-4" />
          SOAP
        </Button>
        <Button 
          variant={viewFormat === 'anamnese' ? "default" : "outline"} 
          onClick={() => setViewFormat('anamnese')}
          className={viewFormat === 'anamnese' ? 'bg-ally-blue hover:bg-ally-blue/90' : 'border-gray-300'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Anamnese Estruturada
        </Button>
      </div>

      {viewFormat === 'soap' && appointment.soapNote ? (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>S - Subjetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.soapNote.subjective}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>O - Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.soapNote.objective}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>A - Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.soapNote.assessment}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>P - Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.soapNote.plan}</p>
            </CardContent>
          </Card>
        </div>
      ) : viewFormat === 'anamnese' && appointment.anamneseNote ? (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Queixa Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.queixaPrincipal}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>História da Doença Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.historiaDoencaAtual}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Antecedentes Patológicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.antecedentesPatologicos}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medicações em Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.medicacoesEmUso}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hábitos de Vida</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.habitosDeVida}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exames Físicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.examesFisicos}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exames Complementares</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.examesComplementares}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.diagnostico}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conduta</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote.conduta}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500">Nenhum relatório disponível</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummary;
