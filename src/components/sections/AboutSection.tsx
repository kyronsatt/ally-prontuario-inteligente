import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section-spacing bg-white">
      <div className="container-ally">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div
            className="fade-in-section"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <div className="bg-white p-4 rounded-2xl">
              <img
                src="/assets/mockups/mockup-anamnese.png"
                alt="Médico utilizando tecnologia durante atendimento"
                className="w-full h-auto scale-125"
              />
            </div>
          </div>

          <div
            className="space-y-6 fade-in-section"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            <h2 className="heading-lg">
              Conheça sua nova{" "}
              <span className="gradient-text">parceira clínica</span>
            </h2>

            <div className="space-y-4 text-md font-light">
              <p>
                A Ally usa{" "}
                <p className="bg-ally-blue/20 inline">
                  Inteligência Artificial
                </p>{" "}
                avançada para ouvir a conversa médico-paciente de forma segura e
                discreta, enquanto você realiza o atendimento com tranquilidade
                e eficiência.
              </p>
              <p>
                Toda a{" "}
                <p className="bg-ally-blue/20 inline">
                  conversa é automaticamente estruturada em formato de
                  prontuário
                </p>
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
