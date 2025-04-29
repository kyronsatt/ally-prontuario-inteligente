
import React from 'react';
import { Clock, FileText, Eye, Shield } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  // Benefícios principais
  const benefits = [
    {
      icon: <Clock className="text-ally-blue" size={36} />,
      title: 'Economia de Tempo',
      description: 'Menos digitação, mais consultas realizadas. Aumente sua produtividade sem sacrificar a qualidade no atendimento.'
    },
    {
      icon: <FileText className="text-ally-blue" size={36} />,
      title: 'Precisão nos Registros',
      description: 'Prontuários mais completos, estruturados e organizados. Informações claras para acompanhamento e decisões precisas.'
    },
    {
      icon: <Eye className="text-ally-blue" size={36} />,
      title: 'Foco no Paciente',
      description: 'Mais olho no olho, menos tela. Fortaleça a relação médico-paciente com uma presença verdadeiramente atenta.'
    },
    {
      icon: <Shield className="text-ally-blue" size={36} />,
      title: 'Redução de Burnout',
      description: 'Menos carga burocrática no final do dia. Diminua o estresse administrativo e recupere o prazer de exercer a medicina.'
    }
  ];

  return (
    <section id="benefits" className="section-spacing">
      <div className="container-ally">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Mais eficiência. Mais humanidade. <span className="gradient-text">Mais liberdade.</span>
          </h2>
          <p className="text-xl text-ally-gray">
            A Ally foi criada para resolver problemas reais da rotina médica, devolvendo a você o que há de mais valioso: seu tempo.
          </p>
        </div>
        
        {/* Grid de cards de benefícios */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all border border-gray-100 fade-in-section"
              style={{ '--delay': `${200 + index * 100}ms` } as React.CSSProperties}
            >
              <div className="mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-ally-gray">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        {/* Testemunho futuro */}
        <div className="mt-20 bg-gradient-to-br from-ally-light to-blue-50 rounded-2xl p-8 text-center max-w-4xl mx-auto fade-in-section" style={{ '--delay': '500ms' } as React.CSSProperties}>
          <h3 className="heading-md mb-6">O que dizem os médicos</h3>
          <div className="italic text-ally-gray mb-6">
            "Em breve, relatos de médicos que já experimentaram a Ally estarão disponíveis aqui. Seja um dos primeiros a testar e compartilhar sua experiência."
          </div>
          <a href="#waitlist" className="text-ally-blue font-medium hover:underline">Entre para nossa lista de espera</a>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
