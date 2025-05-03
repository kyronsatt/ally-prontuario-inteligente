
import React from "react";
import { Mic, FileText, Lightbulb, History } from "lucide-react";

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, number }) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md mb-4 relative fade-in-section"
      style={{ "--delay": `${number * 100}ms` } as React.CSSProperties}
    >
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-ally-blue text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="bg-ally-light p-4 rounded-full text-ally-blue mb-4 md:mb-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-ally-gray">{description}</p>
        </div>
      </div>
    </div>
  );
};

// "Na página inicial do app você deve usar um layout que destaque a proposta de valor do App, que é poupar o tempo do médico. Para isso, mostre dados como quantos minutos estimados foram salvos no dia e na semana, ou quantos pacientes a mais foram atendidos, ou qual o percentual de melhora na produtividade. Você pode usar gráficos ou gauges para mostrar esses dados. Além disso, coloque isso em destaque, antes mesmo do Resumo de atividades. Remova a parte de acesso rápido.

// Além disso, na tela de demonstração da anamnese, melhore a UI, mantendo todas as funcionalidades existentes, com exceção das de "compartilhar" e "ver histórico".  Além disso, o usuário deve ter a opção de editar cada campo da anamnese e isso deve ser persistido no banco de dados. "
const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Mic size={28} />,
      title: "Escuta clínica em tempo real",
      description:
        "A Ally ouve a conversa entre médico e paciente, entendendo o contexto com precisão médica.",
    },
    {
      icon: <FileText size={28} />,
      title: "Geração automática da anamnese estruturada",
      description:
        "O atendimento é transformado em um texto clínico organizado no formato do prontuário.",
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Entrega de insights inteligentes",
      description:
        "A Ally identifica riscos, sintomas relevantes e oportunidades de conduta — considerando também o histórico do paciente.",
    },
    {
      icon: <History size={28} />,
      title: "Acesso ao histórico de atendimentos",
      description:
        "Consulte facilmente anamneses anteriores do paciente para uma visão completa de sua trajetória clínica.",
    }
  ];

  return (
    <section
      id="how-it-works"
      className="section-spacing bg-gray-50 relative overflow-hidden"
    >
      <div className="container-ally">
        <div
          className="text-center max-w-3xl mx-auto mb-12 fade-in-section"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <h2 className="heading-lg mb-4">
            <span className="gradient-text">O que você pode fazer</span> com a Ally
          </h2>
          <p className="text-md md:text-xl text-ally-gray">
            A inteligência da Ally escuta, organiza e gera insights com base na
            conversa em tempo real — e considera até o histórico de atendimentos
            anteriores do paciente.
          </p>
        </div>

        {/* Stacked Step Blocks */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              number={index + 1}
            />
          ))}
        </div>

        {/* Extra information */}
        <div
          className="mt-8 p-5 border border-gray-200 rounded-lg bg-white flex items-start gap-3 max-w-3xl mx-auto fade-in-section"
          style={{ "--delay": "500ms" } as React.CSSProperties}
        >
          <History className="text-ally-blue mt-1 flex-shrink-0" />
          <p className="text-ally-gray">
            <span className="font-semibold">
              Consulta atual + histórico do paciente ={" "}
            </span>
            recomendações mais completas e personalizadas para cada paciente.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
