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
      className="bg-gradient-to-r from-ally-blue/20 to-ally-blue/5 p-6 rounded-xl overflow-clip border-ally-blue/20 border-[1px] mb-4 relative fade-in-section"
      style={{ "--delay": `${number * 100}ms` } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* <div className="bg-ally-blue/10 p-3 rounded-xl text-ally-blue mb-4 md:mb-0"> */}
        <div className="rounded-full p-2 text-ally-blue/30 absolute top-3 -left-10 md:mb-0">
          {icon}
        </div>
        <div className="pl-16">
          <h3 className="text-xl font-semibold mb-2 text-ally-blue">{title}</h3>
          <p className="text-ally-gray">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Mic size={90} />,
      title: "Escuta clínica em tempo real",
      description:
        "A Ally ouve a conversa entre médico e paciente, entendendo o contexto com precisão médica.",
    },
    {
      icon: <FileText size={90} />,
      title: "Geração automática da anamnese estruturada",
      description:
        "O atendimento é transformado em um texto clínico organizado no formato do prontuário.",
    },
    {
      icon: <Lightbulb size={90} />,
      title: "Entrega de insights inteligentes",
      description:
        "A Ally identifica riscos, sintomas relevantes e oportunidades de conduta — considerando também o histórico do paciente.",
    },
    {
      icon: <History size={90} />,
      title: "Acesso ao histórico de atendimentos",
      description:
        "Consulte facilmente anamneses anteriores do paciente para uma visão completa de sua trajetória clínica.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="section-spacing bg-gradient-to-b from-ally-light/30 to-white relative overflow-hidden"
    >
      <div className="container-ally">
        <div
          className="text-center max-w-3xl mx-auto mb-12 fade-in-section"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <h2 className="heading-lg mb-4">
            <span className="gradient-text">O que você pode fazer</span> com a
            Ally
          </h2>
          <p className="text-md md:text-xl text-ally-gray">
            A inteligência da Ally escuta, organiza e gera insights com base na
            conversa em tempo real — e considera até o histórico de atendimentos
            anteriores do paciente.
          </p>
        </div>
        {/* Stacked Step Blocks */}
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
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
      </div>
    </section>
  );
};

export default HowItWorksSection;
