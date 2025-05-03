import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Brain,
  Check,
  PaperclipIcon,
  Shield,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BenefitsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabContent = {
    tab1: {
      icon: Activity,
      tabTitle: "Anamnese estruturada",
      title: "Anamnese estruturada em segundos",
      description:
        "A Ally ouve a conversa da consulta e gera automaticamente uma anamnese clínica completa em até 30 segundos, organizada de acordo com a sua especialidade.",
      benefits: [
        "Mantenha contato visual com o paciente",
        "Reduza em até 40% o tempo gasto com prontuário",
        "Cuide mais e digite menos",
      ],
      image: "/assets/images/female-doctor-5.jpg",
    },
    tab2: {
      icon: Brain,
      tabTitle: "Inteligência clínica",
      title: "Mais que registros: inteligência clínica",
      description:
        "Além de gerar automaticamente documentos como anamnese, Ally oferece relatórios de produtividade e insights inteligentes.",
      benefits: [
        "Acompanhe sua performance e melhore sua prática",
        "Compartilhe resumos clínicos com o paciente",
        "Amplie a confiança e a experiência do atendimento",
      ],
      image: "/assets/images/female-doctor-4.jpg",
    },
    tab3: {
      icon: ShieldCheck,
      tabTitle: "Fácil e segura",
      title: "Segurança e simplicidade",
      description:
        "A Ally funciona do jeito que o médico precisa: é só abrir o app e começar a consulta, em um ambiente de máxima segurança. Todos os dados são anonimizados, criptografados e operam em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
      benefits: [
        "Nenhum áudio é armazenado — descarte automático",
        "Comece a usar em menos de 30 segundos",
        "Gere documentos com inteligência artificial",
      ],
      image: "/assets/images/female-doctor-2.jpg",
    },
  };

  const getTabClassName = (tab: string) => {
    const baseClass = "py-3 px-4 rounded-lg text-center transition-all text-sm";
    return activeTab === tab
      ? `${baseClass} bg-ally-blue/5 text-ally-blue border-[1px] border-ally-blue/70`
      : `${baseClass} bg-ally-light/50 text-ally-gray hover:bg-ally-light border-[1px] border-gray-200`;
  };

  return (
    <section id="benefits" className="section-spacing bg-white">
      <div className="container-ally">
        <div
          className="text-center max-w-3xl mx-auto mb-16 fade-in-section"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <h2 className="heading-lg mb-4">
            Porque você deve{" "}
            <span className="gradient-text">escolher a Ally</span>
          </h2>
          <p className="text-md md:text-xl text-ally-gray">
            Tecnologia que transforma a experiência médica, criada para as
            necessidades reais da sua prática clínica.
          </p>
        </div>

        <div className="max-w-5xl mx-auto fade-in-section">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-transparent">
              {Object.entries(tabContent).map(([key, tab]) => (
                <TabsTrigger value={key} className={getTabClassName(key)}>
                  <tab.icon
                    className={cn(
                      "inline mr-0 p-1",
                      activeTab === key ? "text-ally-blue" : "text-ally-gray"
                    )}
                  />
                  {tab.tabTitle}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(tabContent).map(([key, tab]) => (
              <TabsContent
                key={key}
                value={key}
                className="pt-4 focus:outline-none"
              >
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 flex items-center">
                        <tab.icon className="text-ally-blue inline mr-2" />
                        {tab.title}
                      </h3>
                      <p className="mb-6 text-md font-light">
                        {tab.description}
                      </p>
                      <ul className="space-y-3 text-ally-gray">
                        {tab.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check
                              size={20}
                              className="text-ally-blue min-w-5 mt-0.5"
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="order-first md:order-last transition-all fade-in-10">
                      <img
                        src={tab.image}
                        alt={`Ilustração de ${tab.title}`}
                        className="w-full aspect-video object-cover rounded-2xl outline outline-1 outline-ally-blue/30 outline-offset-4"
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
