import React from "react";
import { Mic, FileText, LightbulbIcon, Heart, ArrowRight } from "lucide-react";
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
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-ally-gray/5 py-7">
      <div className="container-ally">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-5 items-start fade-in-section bg-white/0 p-6 rounded-lg"
              style={{ "--delay": step.delay } as React.CSSProperties}
            >
              <div className="bg-ally-blue/10 w-14 h-14 p-3 rounded-full flex items-center justify-center text-ally-blue">
                {step.icon}
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
