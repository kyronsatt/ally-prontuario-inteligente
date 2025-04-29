
import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="container-ally">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-8 md:gap-12">
          {/* Texto do Hero */}
          <div className="md:w-1/2 space-y-6 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <h1 className="heading-xl">
              <span className="gradient-text">Ally</span> — da voz ao prontuário.
            </h1>
            
            <p className="text-xl md:text-2xl text-ally-gray font-light">
              Transforme suas consultas faladas em prontuários automáticos, estruturados e prontos para uso.
            </p>
            
            <p className="text-lg text-ally-gray">
              A assistente invisível que escuta, organiza e registra seu atendimento — para você focar no cuidado humano.
            </p>
            
            <div className="pt-4">
              <a 
                href="#waitlist" 
                className="btn-primary inline-flex items-center group"
              >
                Quero entrar na lista de espera
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>
          </div>
          
          {/* Imagem/Ilustração do Hero */}
          <div className="md:w-1/2 fade-in-section" style={{ '--delay': '300ms' } as React.CSSProperties}>
            <div className="bg-gradient-to-br from-blue-50 to-ally-light p-4 rounded-2xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="Médico usando Ally durante consulta" 
                className="rounded-xl w-full h-auto shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Forma decorativa */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-ally-blue/5 to-ally-light rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default HeroSection;
