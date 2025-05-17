import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-24 md:pt-48 pb-16 md:pb-32 overflow-hidden">
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
    className="md:w-1/2 space-y-6 fade-in-section"
    style={{ "--delay": "100ms" } as React.CSSProperties}
  >
    <h1 className="heading-xl font-bold mb-2">
      <span className="gradient-text">Ally</span> — da voz ao prontuário.
    </h1>

    <p className="text-xl md:text-2xl text-ally-gray font-extralight">
      Registre consultas automaticamente, sem digitar uma linha. Anamneses
      completas e estruturadas em segundos.
    </p>

    <div className="pt-6">
      <a href="#about">
        <Button size="lg">
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
    className="md:w-1/2 flex justify-end h-full fade-in-section"
    style={{ "--delay": "300ms" } as React.CSSProperties}
  >
    <img
      src="/assets/mockups/mockup-escuta.png"
      alt="Ally Med - Painel de Escuta"
      className="h-full w-full scale-125"
    />
  </div>
);

const DecorativeShape: React.FC = () => (
  <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-ally-blue/5 to-ally-light rounded-full blur-3xl -z-10" />
);

export default HeroSection;
