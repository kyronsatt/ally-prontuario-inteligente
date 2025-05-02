
import React from 'react';
import { Mic, FileText, Lightbulb, History } from 'lucide-react';

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber }) => {
  return (
    <div className="relative flex flex-col items-center text-center mb-8 md:mb-0 fade-in-section" style={{ '--delay': `${stepNumber * 100}ms` } as React.CSSProperties}>
      <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-ally-blue text-white flex items-center justify-center font-medium">
        {stepNumber}
      </div>
      <div className="p-4 rounded-full bg-ally-light text-ally-blue mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-ally-gray">{description}</p>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Mic size={28} />,
      title: "Escuta clínica em tempo real",
      description: "A Ally ouve a conversa entre médico e paciente, entendendo o contexto com precisão médica."
    },
    {
      icon: <FileText size={28} />,
      title: "Geração automática da anamnese estruturada",
      description: "O atendimento é transformado em um texto clínico organizado no formato do prontuário."
    },
    {
      icon: <Lightbulb size={28} />,
      title: "Entrega de insights inteligentes",
      description: "A Ally identifica riscos, sintomas relevantes e oportunidades de conduta — considerando também o histórico do paciente."
    }
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-white relative overflow-hidden">
      <div className="container-ally">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Como a Ally atua <span className="gradient-text">durante e após a consulta.</span>
          </h2>
          <p className="text-xl text-ally-gray">
            A inteligência da Ally escuta, organiza e gera insights com base na conversa em tempo real — e considera até o histórico de atendimentos anteriores do paciente.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (visible only on desktop) */}
          <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-100 hidden md:block"></div>
          
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              stepNumber={index + 1}
            />
          ))}
        </div>
        
        {/* Extra information */}
        <div className="mt-12 p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-start gap-3 max-w-3xl mx-auto fade-in-section" style={{ '--delay': '400ms' } as React.CSSProperties}>
          <History className="text-ally-blue mt-1 flex-shrink-0" />
          <p className="text-ally-gray text-sm">
            <span className="font-medium">Consulta atual + histórico do paciente = </span> 
            recomendações mais completas e personalizadas.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
