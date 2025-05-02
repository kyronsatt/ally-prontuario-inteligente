
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabContent = {
    tab1: {
      title: "Anamnese estruturada em segundos",
      description: "A Ally ouve a conversa da consulta e gera automaticamente uma anamnese clínica completa em até 30 segundos, organizada por tópicos (queixa, HDA, antecedentes, exames e conduta).",
      benefits: [
        "Mantenha contato visual com o paciente",
        "Reduza em até 40% o tempo gasto com prontuário",
        "Cuide mais e digite menos"
      ],
      image: "/lovable-uploads/241b2acf-b875-44a4-ac4e-cb5ead00764d.png"
    },
    tab2: {
      title: "Uso imediato, sem fricção",
      description: "Esqueça integrações, configurações e tutoriais. A Ally funciona do jeito que o médico precisa: é só abrir o app e começar a consulta.",
      benefits: [
        "Comece a usar em menos de 30 segundos",
        "Gere documentos com inteligência artificial",
        "Sem perder tempo com tecnologia"
      ],
      image: "/lovable-uploads/241b2acf-b875-44a4-ac4e-cb5ead00764d.png"
    },
    tab3: {
      title: "Segurança e privacidade reais",
      description: "A Ally garante um ambiente de máxima segurança. Todos os dados são anonimizados, criptografados e operam em conformidade com a LGPD.",
      benefits: [
        "Nenhum áudio é armazenado — descarte automático",
        "Não requer consentimento do paciente",
        "Nenhuma informação pessoal é registrada"
      ],
      image: "/lovable-uploads/241b2acf-b875-44a4-ac4e-cb5ead00764d.png"
    },
    tab4: {
      title: "Mais que registros: inteligência clínica",
      description: "A Ally gera automaticamente documentos como anamnese, receituário e atestados, além de oferecer relatórios de produtividade e benchmarking.",
      benefits: [
        "Acompanhe sua performance e melhore sua prática",
        "Compartilhe resumos clínicos com o paciente",
        "Amplie a confiança e a experiência do atendimento"
      ],
      image: "/lovable-uploads/241b2acf-b875-44a4-ac4e-cb5ead00764d.png"
    }
  };

  return (
    <section id="benefits" className="section-spacing bg-white">
      <div className="container-ally">
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
          <h2 className="heading-lg mb-4">
            Por que você deve <span className="gradient-text">escolher a Ally</span>
          </h2>
          <p className="text-xl text-ally-gray">
            Tecnologia que transforma a experiência médica, criada para as necessidades reais da sua prática clínica.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto fade-in-section" style={{ '--delay': '200ms' } as React.CSSProperties}>
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-transparent">
              <TabsTrigger 
                value="tab1"
                className={`py-3 px-4 rounded-md text-center transition-all ${
                  activeTab === "tab1" 
                    ? "bg-ally-blue text-white border-b-2 border-ally-blue" 
                    : "bg-ally-light/50 text-ally-gray hover:bg-ally-light"
                }`}
              >
                Anamnese estruturada
              </TabsTrigger>
              <TabsTrigger 
                value="tab2"
                className={`py-3 px-4 rounded-md text-center transition-all ${
                  activeTab === "tab2" 
                    ? "bg-ally-blue text-white border-b-2 border-ally-blue" 
                    : "bg-ally-light/50 text-ally-gray hover:bg-ally-light"
                }`}
              >
                Uso imediato
              </TabsTrigger>
              <TabsTrigger 
                value="tab3"
                className={`py-3 px-4 rounded-md text-center transition-all ${
                  activeTab === "tab3" 
                    ? "bg-ally-blue text-white border-b-2 border-ally-blue" 
                    : "bg-ally-light/50 text-ally-gray hover:bg-ally-light"
                }`}
              >
                Segurança total
              </TabsTrigger>
              <TabsTrigger 
                value="tab4"
                className={`py-3 px-4 rounded-md text-center transition-all ${
                  activeTab === "tab4" 
                    ? "bg-ally-blue text-white border-b-2 border-ally-blue" 
                    : "bg-ally-light/50 text-ally-gray hover:bg-ally-light"
                }`}
              >
                Inteligência clínica
              </TabsTrigger>
            </TabsList>

            {Object.entries(tabContent).map(([key, tab]) => (
              <TabsContent 
                key={key} 
                value={key}
                className="mt-2 focus:outline-none"
              >
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-50">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">{tab.title}</h3>
                      <p className="text-ally-gray mb-6">{tab.description}</p>
                      <ul className="space-y-3">
                        {tab.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check size={20} className="text-ally-blue min-w-5 mt-0.5" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-first md:order-last">
                      <img 
                        src={tab.image} 
                        alt={`Ilustração de ${tab.title}`} 
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
