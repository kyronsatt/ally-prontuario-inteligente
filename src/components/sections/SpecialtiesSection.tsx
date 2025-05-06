
import React from "react";

const SpecialtiesSection: React.FC = () => {
  const specialties = [
    "Clínica Médica",
    "Cardiologia",
    "Dermatologia",
    "Ginecologia e Obstetrícia",
    "Endocrinologia",
    "Neurologia",
    "Pediatria",
    "Psiquiatria",
    "Ortopedia",
    "Gastroenterologia",
    "Otorrinolaringologia",
    "Oftalmologia"
  ];

  return (
    <section className="section-spacing bg-gray-50">
      <div className="container-ally">
        <div className="text-center mb-12 fade-in-section" style={{ "--delay": "0ms" } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Para todas as <span className="gradient-text">especialidades</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-ally-gray">
            A Ally se adapta às necessidades específicas de cada especialidade médica
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 fade-in-section" style={{ "--delay": "100ms" } as React.CSSProperties}>
          {specialties.map((specialty, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-lg border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-ally-dark">{specialty}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center fade-in-section" style={{ "--delay": "200ms" } as React.CSSProperties}>
          <p className="text-ally-gray">
            Não encontrou sua especialidade? <a href="#waitlist" className="text-ally-blue hover:underline">Entre em contato</a> para saber como a Ally pode se adaptar às suas necessidades.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
