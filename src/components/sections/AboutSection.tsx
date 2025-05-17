
import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-spacing bg-white py-16 md:py-24">
      <div className="container-ally">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div
            className="fade-in-section order-2 md:order-1"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <div className="bg-white p-4 rounded-2xl">
              <img
                src="/assets/mockups/mockup-anamnese.png"
                alt="Médico utilizando tecnologia durante atendimento"
                className="w-full h-auto md:scale-125"
              />
            </div>
          </div>

          <div
            className="space-y-6 fade-in-section order-1 md:order-2"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Conheça sua nova{" "}
              <span className="gradient-text">parceira clínica</span>
            </h2>

            <div className="space-y-4 text-md font-light">
              <p>
                A Ally usa{" "}
                <span className="bg-ally-blue/20 inline">
                  Inteligência Artificial
                </span>{" "}
                avançada para ouvir a conversa médico-paciente de forma segura e
                discreta, enquanto você realiza o atendimento com tranquilidade
                e eficiência.
              </p>
              <p>
                Toda a{" "}
                <span className="bg-ally-blue/20 inline">
                  conversa é automaticamente estruturada em formato de
                  prontuário
                </span>
                , seguindo os padrões médicos e organizando as informações de
                forma lógica e útil para a sua prática.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
