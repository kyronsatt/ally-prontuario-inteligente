import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Printer,
  Share2,
} from "lucide-react";
import { useAppointment } from "@/context/AppointmentContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePatient } from "@/context/PatientContext";
import { toast } from "sonner";

const AppointmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, isProcessing } = useAppointment();
  const { patient } = usePatient();
  const [searchParams] = useSearchParams();
  const [viewFormat, setViewFormat] = useState<string>("soap");

  // Get format from URL or context
  useEffect(() => {
    const formatParam = searchParams.get("format");
    if (formatParam) {
      setViewFormat(formatParam);
    } else if (appointment.selectedFormat) {
      setViewFormat(appointment.selectedFormat);
    }
  }, [searchParams, appointment.selectedFormat]);

  // Redirect if no report is available
  useEffect(() => {
    if (!isProcessing && (!appointment.soapNote || !appointment.anamneseNote)) {
      navigate("/app/novo-atendimento");
    }
  }, [appointment, isProcessing, navigate]);

  // Format date
  const formattedDate = appointment.date
    ? format(appointment.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    : "";

  // Handle print functionality
  const handlePrint = () => {
    window.print();
    toast("Imprimindo relatório", {
      description: "Enviando para impressão...",
    });
  };

  // Handle mock download
  const handleDownload = () => {
    toast("Download iniciado", {
      description: "Seu relatório está sendo preparado para download.",
    });
    // Mock functionality - in a real app, would generate and download PDF
  };

  // Handle mock share
  const handleShare = () => {
    toast("Compartilhar relatório", {
      description: "Funcionalidade em desenvolvimento.",
    });
    // Mock functionality - would open sharing options
  };

  if (isProcessing) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-blue-50 p-4">
            <Loader2 className="h-12 w-12 text-ally-blue animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">
            Finalizando relatório médico...
          </h2>
          <p className="text-gray-600">
            Quase pronto! Estamos finalizando o relatório da sua consulta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate("/app")}
          variant="ghost"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Resumo do Atendimento
        </h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/app/historico")} variant="outline">
            Ver histórico
          </Button>
          <Button
            onClick={() => navigate("/app/novo-atendimento")}
            className="bg-ally-blue hover:bg-ally-blue/90"
          >
            Novo atendimento
          </Button>
        </div>
      </div>

      {/* Patient info card */}
      <Card className="mb-8 border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardDescription className="text-sm text-gray-600 mb-1">
                Paciente
              </CardDescription>
              <CardTitle className="text-2xl font-semibold">
                {appointment.patient?.name ?? patient?.name}
              </CardTitle>
            </div>
            <div className="text-right">
              <CardDescription className="text-sm text-gray-600 mb-1">
                Data do atendimento
              </CardDescription>
              <p className="font-medium text-gray-800">{formattedDate}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Format selector and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex gap-3">
          <Button
            variant={viewFormat === "soap" ? "default" : "outline"}
            onClick={() => setViewFormat("soap")}
            className={
              viewFormat === "soap"
                ? "bg-ally-blue hover:bg-ally-blue/90"
                : "border-gray-300"
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            SOAP
          </Button>
          <Button
            variant={viewFormat === "anamnese" ? "default" : "outline"}
            onClick={() => setViewFormat("anamnese")}
            className={
              viewFormat === "anamnese"
                ? "bg-ally-blue hover:bg-ally-blue/90"
                : "border-gray-300"
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Anamnese Estruturada
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" /> Compartilhar
          </Button>
        </div>
      </div>

      {/* SOAP Note View */}
      {viewFormat === "soap" && appointment.soapNote ? (
        <div className="space-y-6 animate-fade-in print:space-y-4">
          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-blue-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                S - Subjetivo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.soapNote.subjective}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-green-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                O - Objetivo
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.soapNote.objective}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-amber-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                A - Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.soapNote.assessment}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-purple-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">P - Plano</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.soapNote.plan}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : viewFormat === "anamnese" && appointment.anamneseNote ? (
        <div className="space-y-6 animate-fade-in print:space-y-4">
          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-blue-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Queixa Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.queixaPrincipal}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-indigo-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                História da Doença Atual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.historiaDoencaAtual}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-teal-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Antecedentes Patológicos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.antecedentesPatologicos}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-cyan-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Medicações em Uso
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.medicacoesEmUso}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-orange-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Hábitos de Vida
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.habitosDeVida}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-emerald-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Exames Físicos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.examesFisicos}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-sky-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Exames Complementares
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.examesComplementares}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-rose-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">
                Diagnóstico
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.diagnostico}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow transition-shadow border-l-4 border-l-violet-400 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-violet-50 to-transparent pb-3">
              <CardTitle className="text-xl text-gray-800">Conduta</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-700 whitespace-pre-line">
                {appointment.anamneseNote.conduta}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum relatório disponível</p>
          <p className="text-gray-400 mt-2">
            Por favor, inicie um novo atendimento para gerar um relatório
          </p>
        </div>
      )}

      {/* Print styles - hidden in normal view */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          button, .no-print { display: none !important; }
          body { font-size: 12pt; }
          .card { break-inside: avoid; margin-bottom: 1rem; border: 1px solid #eee !important; }
          .shadow-sm, .shadow, .shadow-md, .hover\\:shadow { box-shadow: none !important; }
        }
      `,
        }}
      />
    </div>
  );
};

export default AppointmentSummary;
