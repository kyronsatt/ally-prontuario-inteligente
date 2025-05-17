import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const PricingSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container-ally">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Planos simples e transparentes</h2>
          <p className="text-ally-gray text-lg max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades e evolua sua prática
            clínica com a Ally
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-ally-dark mb-2">
                Plano Free
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$0</span>
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
              size="lg"
            >
              Comece Gratuitamente
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white p-8 rounded-2xl border border-ally-blue shadow-md flex flex-col relative overflow-visible">
            <div className="absolute -top-3 right-6 bg-ally-blue text-white text-md font-bold px-4 py-1 rounded-full">
              Recomendado
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-semibold text-ally-dark mb-2">
                Plano Pro
              </h3>
              <div className="mb-2">
                <span className="text-4xl font-bold">R$149,90</span>
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

            <Button onClick={handleTryPro} className="w-full mt-auto" size="lg">
              Experimente Gratuitamente
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
