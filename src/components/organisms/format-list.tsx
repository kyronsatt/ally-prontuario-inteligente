import React from "react";
import FormatCard from "@/components/molecules/format-card";
import { FileText, Clock } from "lucide-react";

interface FormatListProps {
  onFormatSelect: (format: string) => void;
}

const FormatList: React.FC<FormatListProps> = ({ onFormatSelect }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Formatos disponíveis</h2>
      <div className="grid gap-4 mb-8">
        <FormatCard
          icon={FileText}
          title="SOAP (padrão)"
          description="Formato padrão de registro médico: Subjetivo, Objetivo, Avaliação e Plano"
          onClick={() => onFormatSelect("soap")}
        />
        <FormatCard
          icon={FileText}
          title="Anamnese Estruturada"
          description="Formato completo com histórico médico, exames e conclusões detalhadas"
          onClick={() => onFormatSelect("anamnese")}
        />
      </div>

      <h2 className="text-lg font-medium mb-4 text-gray-500">
        Em desenvolvimento
      </h2>
      <div className="grid gap-4 opacity-70">
        <FormatCard
          icon={Clock}
          title="Anamnese Focada"
          description="Formato resumido voltado para a queixa principal"
          disabled
          isComingSoon
        />
        <FormatCard
          icon={Clock}
          title="Anamnese por Especialidade"
          description="Formato adaptado para cada especialidade médica"
          disabled
          isComingSoon
        />
        <FormatCard
          icon={Clock}
          title="Anamnese Ocupacional"
          description="Formato específico para medicina do trabalho"
          disabled
          isComingSoon
        />
        <FormatCard
          icon={Clock}
          title="Revisão de Sistemas"
          description="Análise detalhada de cada sistema corporal"
          disabled
          isComingSoon
        />
        <FormatCard
          icon={Clock}
          title="Psicossocial"
          description="Formato voltado para avaliação de aspectos psicológicos e sociais"
          disabled
          isComingSoon
        />
      </div>
    </div>
  );
};

export default FormatList;
