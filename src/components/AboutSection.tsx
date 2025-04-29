
import React from 'react';
import { Check, FileText, Timer, Shield, User } from 'lucide-react';

const AboutSection: React.FC = () => {
  // Lista de benefícios com ícones
  const features = [
    {
      icon: <FileText className="text-ally-blue" size={24} />,
      text: 'Conversa transformada em texto estruturado.'
    },
    {
      icon: <Timer className="text-ally-blue" size={24} />,
      text: 'Economia de tempo em cada atendimento.'
    },
    {
      icon: <Shield className="text-ally-blue" size={24} />,
      text: 'Segurança e privacidade de dados.'
    },
    {
      icon: <FileText className="text-ally-blue" size={24} />,
      text: 'Tecnologia que entende contextos clínicos.'
    },
    {
      icon: <User className="text-ally-blue" size={24} />,
      text: 'Mais atenção ao paciente, menos ao teclado.'
    }
  ];

  return (
    <section id="about" className="section-spacing bg-gradient-to-b from-white to-ally-light/30">
      <div className="container-ally">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Nova imagem para a seção Sobre */}
          <div className="fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <div className="bg-white p-4 rounded-2xl shadow-md">
              <img
                src="https://assets-global.website-files.com/62dfe3ef9bf94906205d8a0e/6556d572d5229f133d5d2a43_shutterstock_1976499969.jpg"
                alt="Médico utilizando tecnologia durante atendimento"
                className="rounded-xl w-full h-auto"
              />
            </div>
          </div>
          
          <div className="space-y-6 fade-in-section" style={{ '--delay': '200ms' } as React.CSSProperties}>
            <h2 className="heading-lg">
              Conheça sua nova <span className="gradient-text">parceira clínica</span>
            </h2>
            
            <div className="space-y-4 text-lg">
              <p>
                A Ally usa Inteligência Artificial avançada para ouvir a conversa médico-paciente de forma segura e discreta, enquanto você realiza o atendimento com tranquilidade.
              </p>
              <p>
                Toda a conversa é automaticamente estruturada em formato de prontuário, seguindo os padrões médicos e organizando as informações de forma lógica e útil para a sua prática.
              </p>
              <p>
                Reduza drasticamente o tempo de digitação e preenchimento manual, eliminando a burocracia que afasta você do que realmente importa: o cuidado com seus pacientes.
              </p>
            </div>
          </div>
        </div>
        
        {/* Grid de features com ícones */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-start gap-4 fade-in-section"
              style={{ '--delay': `${300 + index * 100}ms` } as React.CSSProperties}
            >
              <div className="bg-ally-light p-2 rounded-lg">
                {feature.icon}
              </div>
              <p className="text-lg">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
