import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleStartFree = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/login");
    }
  };

  const handleTryPro = () => {
    if (user) {
      navigate("/app/subscription");
    } else {
      navigate("/login?plan=pro");
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
      <div className="container-ally px-4 md:px-8 lg:px-24">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4">
            Planos simples e transparentes
          </h2>
          <p className="text-ally-gray text-md lg:text-lg max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades e evolua sua prática
            clínica com a Ally
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-12">
          {/* Free Plan */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full hover:scale-105 transition-all">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-ally-dark mb-2">
                Plano Free
              </h3>
              <div className="mb-6">
                <span className="text-3xl md:text-4xl font-bold">R$0</span>
                <span className="text-ally-gray">/mês</span>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Até 10 consultas por mês</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Transcrição automática de consulta</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Anamneses estruturadas em segundos</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Histórico de atendimentos</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleStartFree}
              variant="outline"
              className="w-full mt-auto"
              size={isMobile ? "default" : "lg"}
            >
              Comece Gratuitamente
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-ally-blue shadow-2xl shadow-ally-blue/20 flex flex-col h-full relative overflow-visible hover:scale-105 transition-all">
            <div className="absolute -top-3 right-4 md:right-6 bg-ally-blue text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
              Recomendado
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-ally-dark mb-2">
                Plano Pro
              </h3>
              <div className="mb-2">
                <span className="text-3xl md:text-4xl font-bold">R$149,90</span>
                <span className="text-ally-gray">/mês</span>
              </div>
              <p className="text-sm text-ally-blue mb-6">
                5 dias de teste gratuito
              </p>

              <div className="border-t border-gray-100 my-6"></div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>
                    Consultas{" "}
                    <strong className="bg-ally-blue/10">ilimitadas</strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Transcrição automática de consulta</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Anamneses estruturadas em segundos</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Histórico de atendimentos</span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>
                    Acesso a{" "}
                    <strong className="bg-ally-blue/10">
                      insights clínicos personalizados
                    </strong>
                  </span>
                </li>
                <li className="flex items-start">
                  <Check
                    size={18}
                    className="text-green-500 mt-0.5 mr-2 shrink-0"
                  />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={handleTryPro}
              className="w-full mt-auto"
              size={isMobile ? "default" : "lg"}
            >
              Experimente Gratuitamente
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
