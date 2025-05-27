import React from "react";
import { Mic, FileText, LightbulbIcon } from "lucide-react";
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
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-ally-gray/5 py-7">
      <div className="container-ally">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-6 items-start fade-in-section bg-white/0 p-6 rounded-lg"
              style={{ "--delay": step.delay } as React.CSSProperties}
            >
              <div className="rounded-full ring-ally-blue/20 ring-1 ring-offset-4">
                <div className="bg-ally-blue/10 w-12 h-12 p-3 rounded-full flex items-center justify-center text-ally-blue/80 ring-ally-blue/50 ring-1 ring-offset-2 shadow-inner shadow-ally-blue/10">
                  {step.icon}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg md:text-xl font-medium">{step.title}</h3>
                <p className="text-ally-gray/70 text-sm font-light md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
