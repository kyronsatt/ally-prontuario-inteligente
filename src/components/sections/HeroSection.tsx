import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 md:pt-48 pb-16 md:pb-32 overflow-hidden">
      <div className="container-ally h-full">
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between h-full gap-8 md:gap-12">
          <HeroContent />
          <HeroImage />
        </div>
      </div>

      <DecorativeShape />
    </section>
  );
};

const HeroContent: React.FC = () => (
  <div
    className="md:w-1/2 space-y-6 fade-in-section px-2 md:px-0"
    style={{ "--delay": "100ms" } as React.CSSProperties}
  >
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight">
      <span className="gradient-text">Ally</span> — da voz ao prontuário.
    </h1>

    <p className="text-lg md:text-xl lg:text-2xl text-ally-gray font-extralight">
      Registre consultas automaticamente, sem digitar uma linha. Anamneses
      completas e estruturadas em segundos.
    </p>

    <div className="pt-6">
      <a href="#about">
        <Button size="lg" className="w-full md:w-auto">
          Ver como funciona na prática
          <ArrowRight
            className="ml-2 group-hover:translate-x-1 transition-transform"
            size={20}
          />
        </Button>
      </a>
    </div>
  </div>
);

const HeroImage: React.FC = () => (
  <div
    className="md:w-1/2 flex relative justify-center md:justify-end h-full fade-in-section overflow-visible"
    style={{ "--delay": "300ms" } as React.CSSProperties}
  >
    {/* <div className="w-full h-full scale-90 bg-gradient-to-b from-ally-blue to-[#00e6e6] absolute rounded-full left-0 blur-3xl" /> */}
    <img
      src="/assets/mockups/mockup-escuta.png"
      alt="Ally Med - Painel de Escuta"
      className="h-full w-full object-contain md:scale-125"
    />
  </div>
);

const DecorativeShape: React.FC = () => (
  <div className="absolute -bottom-32 -right-32 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-ally-blue/5 to-ally-light rounded-full blur-3xl -z-10" />
);

export default HeroSection;
