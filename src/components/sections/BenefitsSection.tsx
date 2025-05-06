
import React from "react";
import { CheckCircle2, FileText, Clock, Brain } from "lucide-react";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 fade-in-section"
      style={{ "--delay": delay } as React.CSSProperties}
    >
      <div className="flex items-center mb-4">
        <div className="bg-ally-blue/10 p-3 rounded-lg text-ally-blue">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-ally-gray">{description}</p>
    </div>
  );
};

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Documentação Médica Simplificada",
      description: "Registros detalhados de consultas sem o trabalho de digitação. Prontuários organizados e facilmente acessíveis.",
      delay: "100ms"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Economia de Tempo",
      description: "Reduza o tempo gasto com documentação em até 70%. Mais tempo de qualidade com seus pacientes.",
      delay: "200ms"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Inteligência Clínica",
      description: "Insights automáticos ajudam a não perder detalhes importantes durante a consulta, elevando a qualidade do atendimento.",
      delay: "300ms"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Prática Médica Aprimorada",
      description: "Foco total na interação médico-paciente, sem distrações. Melhore sua satisfação profissional e a experiência do paciente.",
      delay: "400ms"
    }
  ];

  return (
    <section id="benefits" className="section-spacing bg-gray-50">
      <div className="container-ally">
        <div className="text-center mb-12 fade-in-section" style={{ "--delay": "0ms" } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Por que escolher a <span className="gradient-text">Ally</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-ally-gray">
            Transforme sua prática médica com tecnologia que entende suas necessidades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              delay={benefit.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
