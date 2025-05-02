import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container-ally h-full">
        <div className="flex flex-col-reverse md:flex-row md:items-center justify-between h-full gap-8 md:gap-12">
          {/* Texto do Hero */}
          <div
            className="md:w-1/2 space-y-6 fade-in-section"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <h1 className="heading-xl font-bold">
              <span className="gradient-text">Ally</span> — da voz ao
              prontuário.
            </h1>

            <p className="text-xl md:text-2xl text-ally-gray font-extralight">
              Registre consultas automaticamente, sem digitar uma linha.
              Anamneses completas e estruturadas em segundos.
            </p>

            <p className="text-md font-extralight text-ally-gray">
              Reduza até 40% do tempo gasto com o prontuário e aumente sua
              presença com o paciente. Menos distrações, mais performance.
            </p>

            <div className="pt-4">
              <a
                href="#about"
                className="btn-primary inline-flex items-center group"
              >
                Ver como funciona na prática
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </a>
            </div>
          </div>

          {/* Imagem/Ilustração do Hero */}
          <div
            className="md:w-1/2 flex justify-end h-full fade-in-section"
            style={{ "--delay": "300ms" } as React.CSSProperties}
          >
            <img
              src="/assets/images/female-doctor-1.jpg"
              alt="Médico usando Ally durante consulta"
              className="rounded-tr-[200px] rounded-b-xl rounded-tl-xl w-full md:w-full xl:w-2/3 h-auto max-h-[60vh] object-cover outline outline-[1px] outline-offset-4 outline-ally-blue/40"
            />
          </div>
        </div>
      </div>

      {/* Forma decorativa */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-ally-blue/5 to-ally-light rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default HeroSection;
