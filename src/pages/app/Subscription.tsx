
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-standardized-toast";
import { supabase } from "@/integrations/supabase/client";

interface PlanDetails {
  active: boolean;
  type: 'free' | 'pro';
  subscription_end?: string;
  subscription_id?: string;
  trial_end?: string;
  monthly_consultations_limit?: number;
  consultations_used?: number;
}

const Subscription: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        // For now, we'll show mock data until we implement the full subscription backend
        // This would be replaced with a real API call later
        setTimeout(() => {
          setPlan({
            active: true,
            type: 'free',
            monthly_consultations_limit: 10,
            consultations_used: 3
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching subscription:", error);
        toast({
          title: "Erro ao carregar informações da assinatura",
          description: "Por favor, tente novamente mais tarde.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const upgradeToProPlan = async () => {
    setProcessingAction(true);
    try {
      // This would be replaced with the Stripe checkout logic
      toast({
        title: "Redirecionando para o checkout",
        description: "Você será redirecionado para a página de pagamento.",
      });
      
      // Simulate redirect delay
      setTimeout(() => {
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: "A integração com pagamentos será implementada em breve.",
        });
        setProcessingAction(false);
      }, 1500);
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast({
        title: "Erro ao processar upgrade",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
      setProcessingAction(false);
    }
  };

  const manageBilling = async () => {
    setProcessingAction(true);
    try {
      // This would be replaced with the Stripe Customer Portal logic
      toast({
        title: "Redirecionando para o portal de gerenciamento",
        description: "Você será redirecionado para gerenciar sua assinatura.",
      });
      
      // Simulate redirect delay
      setTimeout(() => {
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: "O portal de gerenciamento será implementado em breve.",
        });
        setProcessingAction(false);
      }, 1500);
    } catch (error) {
      console.error("Error managing subscription:", error);
      toast({
        title: "Erro ao acessar gerenciamento",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive"
      });
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-ally-blue mb-4" />
        <p className="text-lg text-ally-gray">Carregando informações da assinatura...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/app")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao dashboard
      </Button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Minha Assinatura</h1>
        <p className="text-ally-gray text-lg">
          Gerencie seu plano e aproveite todos os benefícios da Ally
        </p>
      </div>

      {/* Current Plan Info */}
      <Card className="mb-8">
        <CardHeader className="bg-ally-blue/10 pb-6">
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl">
              Plano atual: <span className="font-bold text-ally-blue">{plan?.type === 'pro' ? 'Pro' : 'Free'}</span>
            </span>
            {plan?.type === 'pro' && (
              <span className="bg-green-500 text-white text-xs px-4 py-1 rounded-full uppercase font-medium">Ativo</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {plan?.type === 'free' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-ally-gray mb-1">Limite de consultas</p>
                  <p className="text-lg font-medium">{plan.consultations_used}/{plan.monthly_consultations_limit} utilizadas este mês</p>
                </div>
                <div className="w-40 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-ally-blue rounded-full" 
                    style={{ width: `${(plan.consultations_used! / plan.monthly_consultations_limit!) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={upgradeToProPlan}
                disabled={processingAction}
              >
                {processingAction ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando</>
                ) : (
                  'Fazer upgrade para o plano Pro'
                )}
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="text-sm text-ally-gray mb-1">Status da assinatura</p>
                <p className="text-lg font-medium">
                  {plan.trial_end ? 
                    `Período de teste gratuito (termina em ${new Date(plan.trial_end).toLocaleDateString()})` : 
                    `Ativa até ${new Date(plan.subscription_end!).toLocaleDateString()}`
                  }
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={manageBilling}
                disabled={processingAction}
              >
                {processingAction ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando</>
                ) : (
                  'Gerenciar assinatura'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <h2 className="text-2xl font-semibold mb-6">Comparação de planos</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left">Funcionalidades</th>
              <th className="py-4 px-6 text-center">Free</th>
              <th className="py-4 px-6 text-center bg-ally-blue/5">Pro</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-4 px-6">Consultas mensais</td>
              <td className="py-4 px-6 text-center">10</td>
              <td className="py-4 px-6 text-center bg-ally-blue/5">Ilimitadas</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6">Geração de documentos clínicos</td>
              <td className="py-4 px-6 text-center">Básica</td>
              <td className="py-4 px-6 text-center bg-ally-blue/5">Completa com IA</td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6">Insights clínicos personalizados</td>
              <td className="py-4 px-6 text-center">
                <span className="text-red-500">✕</span>
              </td>
              <td className="py-4 px-6 text-center bg-ally-blue/5">
                <Check size={20} className="text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6">Integração com histórico de consultas</td>
              <td className="py-4 px-6 text-center">
                <span className="text-red-500">✕</span>
              </td>
              <td className="py-4 px-6 text-center bg-ally-blue/5">
                <Check size={20} className="text-green-500 mx-auto" />
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-4 px-6">Suporte prioritário</td>
              <td className="py-4 px-6 text-center">
                <span className="text-red-500">✕</span>
              </td>
              <td className="py-4 px-6 text-center bg-ally-blue/5">
                <Check size={20} className="text-green-500 mx-auto" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscription;
