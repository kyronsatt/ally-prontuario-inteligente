
import React from "react";
import { Mic, FileText, LightbulbIcon, Heart } from "lucide-react";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Gravação Inteligente",
      description: "Durante a consulta, a Ally captura a conversa médico-paciente de forma segura e confidencial.",
      delay: "100ms"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Estruturação Automática",
      description: "Nossa IA transforma a conversa em uma anamnese estruturada e completa em segundos.",
      delay: "200ms"
    },
    {
      icon: <LightbulbIcon className="h-8 w-8" />,
      title: "Insights Clínicos",
      description: "Identificação automática de pontos relevantes, riscos potenciais e achados importantes.",
      delay: "300ms"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Prática Médica Aprimorada",
      description: "Dedique mais tempo à relação com o paciente e menos à documentação.",
      delay: "400ms"
    }
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-white">
      <div className="container-ally">
        <div className="text-center mb-12 fade-in-section" style={{ "--delay": "0ms" } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Como <span className="gradient-text">funciona</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-ally-gray">
            Um processo simples que revoluciona sua rotina médica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center fade-in-section"
              style={{ "--delay": step.delay } as React.CSSProperties}
            >
              <div className="bg-ally-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-ally-blue">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-ally-gray">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center fade-in-section" style={{ "--delay": "500ms" } as React.CSSProperties}>
          <a href="#waitlist" className="btn-primary inline-flex items-center">
            Experimentar agora
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
