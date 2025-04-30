
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment } = useAppointment();
  const [searchParams] = useSearchParams();
  const [viewFormat, setViewFormat] = useState<string>('soap');

  // Recuperar formato selecionado da URL ou do contexto
  useEffect(() => {
    const formatParam = searchParams.get('format');
    if (formatParam) {
      setViewFormat(formatParam);
    } else if (appointment.selectedFormat) {
      setViewFormat(appointment.selectedFormat);
    }
  }, [searchParams, appointment.selectedFormat]);

  // Redirecionar se não houver prontuário
  useEffect(() => {
    if (!appointment.soapNote.subjective) {
      navigate('/app/novo-atendimento');
    }
  }, [appointment, navigate]);

  // Formatação da data
  const formattedDate = appointment.date
    ? format(appointment.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    : '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resumo do Atendimento</h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate('/app/historico')} variant="outline">
            Ver histórico
          </Button>
          <Button onClick={() => navigate('/app/novo-atendimento')}>
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
          className={viewFormat === 'soap' ? '' : 'border-gray-300'}
        >
          <FileText className="mr-2 h-4 w-4" />
          SOAP
        </Button>
        <Button 
          variant={viewFormat === 'anamnese' ? "default" : "outline"} 
          onClick={() => setViewFormat('anamnese')}
          className={viewFormat === 'anamnese' ? '' : 'border-gray-300'}
        >
          <FileText className="mr-2 h-4 w-4" />
          Anamnese Estruturada
        </Button>
      </div>

      {viewFormat === 'soap' ? (
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
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Queixa Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.queixaPrincipal}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>História da Doença Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.historiaDoencaAtual}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Antecedentes Patológicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.antecedentesPatologicos}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medicações em Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.medicacoesEmUso}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hábitos de Vida</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.habitosDeVida}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exames Físicos</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.examesFisicos}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Exames Complementares</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.examesComplementares}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.diagnostico}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Conduta</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{appointment.anamneseNote?.conduta}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AppointmentSummary;
