import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-20 md:pt-24 pb-16 md:pb-28 overflow-hidden relative">
      <img
        className="absolute right-0 top-0 w-auto h-full scale-150 opacity-20"
        src="/assets/illustration/wave.svg"
      />
      <div className="px-10 h-[60vh] md:h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-center h-full gap-8 md:gap-12 xl:gap-24">
          <HeroImage />
          <HeroContent />
        </div>
      </div>
    </section>
  );
};

const HeroContent: React.FC = () => (
  <div
    className="md:w-1/3 space-y-6 fade-in-section"
    style={{ "--delay": "100ms" } as React.CSSProperties}
  >
    <h1 className="text-5xl xl:text-6xl font-bold mb-2 leading-tight">
      <span className="gradient-text">Ally</span> — da voz ao prontuário.
    </h1>

    <p className="text-md lg:text-xl text-ally-gray font-extralight">
      Registre consultas automaticamente, sem digitar uma linha. Anamneses
      completas e estruturadas em segundos.
    </p>

    <div className="pt-6">
      <a href="#how-it-works">
        <Button size="lg" className="w-full md:w-auto">
          Ver como funciona na prática
          <Sparkles
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
    className="md:w-2/3 md:-ml-[30vw] flex relative justify-center md:justify-end h-full fade-in-section overflow-visible"
    style={{ "--delay": "300ms" } as React.CSSProperties}
  >
    <div className="w-full h-full bg-black/10 absolute rounded-2xl left-0 blur-3xl" />
    <img
      src="/assets/mockups/mix/ally-devices-1.png"
      alt="Ally Med - Painel de Escuta"
      className="h-full w-full object-contain z-50"
    />
  </div>
);

export default HeroSection;
