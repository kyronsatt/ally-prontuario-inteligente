
import React from "react";
import { SectionHeading } from "@/components/atoms/section-heading";
import { HighlightedText } from "@/components/atoms/highlighted-text";

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
            <SectionHeading>
              Conheça sua nova <span className="gradient-text">parceira clínica</span>
            </SectionHeading>

            <div className="space-y-4 text-md font-light">
              <p>
                A Ally usa <HighlightedText>Inteligência Artificial</HighlightedText>{" "}
                avançada para ouvir a conversa médico-paciente de forma segura e
                discreta, enquanto você realiza o atendimento com tranquilidade
                e eficiência.
              </p>
              <p>
                Toda a{" "}
                <HighlightedText>
                  conversa é automaticamente estruturada em formato de
                  prontuário
                </HighlightedText>, seguindo os padrões médicos e organizando as informações de
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
