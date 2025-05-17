
import React from "react";
import {
  Mic,
  FileText,
  LightbulbIcon,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const HowItWorksSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  const steps = [
    {
      icon: <Mic className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Gravação Inteligente",
      description:
        "Durante a consulta, a Ally captura a conversa médico-paciente de forma segura e confidencial.",
      delay: "100ms",
    },
    {
      icon: <FileText className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Estruturação Automática",
      description:
        "Nossa IA transforma a conversa em uma anamnese estruturada e completa em segundos.",
      delay: "200ms",
    },
    {
      icon: <LightbulbIcon className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Insights Clínicos",
      description:
        "Identificação automática de pontos relevantes, riscos potenciais e achados importantes.",
      delay: "300ms",
    },
    {
      icon: <Heart className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Qualidade de atendimento",
      description:
        "Dedique mais tempo à relação com o paciente e menos à documentação.",
      delay: "400ms",
    },
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-gray-50 py-16 md:py-24">
      <div className="container-ally px-4 md:px-8 lg:px-24">
        <div
          className="text-center max-w-3xl mx-auto mb-8 md:mb-12 fade-in-section"
          style={{ "--delay": "0ms" } as React.CSSProperties}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
            Como <span className="gradient-text">funciona</span>
          </h2>
          <p className="text-md md:text-lg lg:text-xl text-ally-gray">
            Um processo simples que revoluciona sua rotina médica
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center fade-in-section bg-white p-6 rounded-xl shadow-sm"
              style={{ "--delay": step.delay } as React.CSSProperties}
            >
              <div className="bg-ally-blue/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-ally-blue">
                {step.icon}
              </div>
              <h3 className="text-lg md:text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-ally-gray text-sm md:text-base">{step.description}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-10 md:mt-16 text-center fade-in-section"
          style={{ "--delay": "500ms" } as React.CSSProperties}
        >
          <a href="#pricing">
            <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
              Experimentar agora
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
