
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Terms: React.FC = () => {
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    document.title = "Termos de Uso | Ally";
    trackPageView('terms_page');
  }, [trackPageView]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow container-ally py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        
        <div className="prose mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Termos de Uso</h1>
          
          <p className="text-gray-600 mb-6">Última atualização: 06 de Maio de 2025</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar a plataforma Ally ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com alguma parte destes termos, não poderá acessar o Serviço.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Descrição do Serviço</h2>
          <p>
            A Ally é uma plataforma de apoio à prática médica que oferece ferramentas para registro de prontuário e anamnese estruturada. O Serviço destina-se apenas a profissionais de saúde devidamente registrados nos conselhos profissionais competentes.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Conta de Usuário</h2>
          <p>
            Para utilizar o Serviço, você deve criar uma conta e fornecer informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem sob sua conta.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Responsabilidades do Usuário</h2>
          <ul className="list-disc pl-6 mt-4 mb-6">
            <li>Você concorda em utilizar o Serviço apenas para fins legais e de acordo com estes Termos.</li>
            <li>Você é responsável por obter o consentimento adequado dos pacientes antes de utilizar o Serviço para documentar informações médicas.</li>
            <li>Você não deve compartilhar suas credenciais de acesso com terceiros não autorizados.</li>
            <li>Você é responsável por garantir que as informações inseridas sejam precisas e estejam em conformidade com as regulamentações aplicáveis.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Privacidade e Dados do Paciente</h2>
          <p>
            A proteção dos dados do paciente é uma responsabilidade compartilhada entre a Ally e seus usuários:
          </p>
          <ul className="list-disc pl-6 mt-4 mb-6">
            <li>A Ally implementa medidas de segurança técnicas e organizacionais para proteger os dados armazenados no Serviço.</li>
            <li>Você, como profissional de saúde, é o responsável pelo tratamento dos dados pessoais e de saúde inseridos na plataforma.</li>
            <li>A Ally atua como operadora dos dados, conforme definido na Lei Geral de Proteção de Dados (LGPD).</li>
            <li>Para mais informações sobre como tratamos os dados, consulte nossa Política de Privacidade.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Licença de Uso</h2>
          <p>
            A Ally concede a você uma licença limitada, não exclusiva e não transferível para utilizar o Serviço de acordo com estes Termos. Esta licença não inclui:
          </p>
          <ul className="list-disc pl-6 mt-4 mb-6">
            <li>Modificação, engenharia reversa ou criação de trabalhos derivados baseados no Serviço;</li>
            <li>Uso do Serviço para fins comerciais não autorizados;</li>
            <li>Transferência de sua conta para terceiros.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Conteúdo Médico e Limitações</h2>
          <p>
            O conteúdo gerado pelo Serviço, como resumos de anamnese e insights clínicos, deve ser considerado como um apoio à decisão clínica e não como um substituto para o julgamento profissional do médico. Você é responsável por verificar a precisão de qualquer informação gerada pelo Serviço antes de utilizá-la para fins clínicos.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Alterações nos Termos</h2>
          <p>
            A Ally reserva-se o direito de modificar estes Termos a qualquer momento. As alterações entrarão em vigor após a publicação dos Termos atualizados no Serviço. O uso continuado do Serviço após a publicação das alterações constitui aceitação dos novos Termos.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Suspensão e Encerramento</h2>
          <p>
            A Ally pode suspender ou encerrar seu acesso ao Serviço, com ou sem aviso prévio, por violação destes Termos ou por qualquer outro motivo que considere apropriado.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Limitação de Responsabilidade</h2>
          <p>
            O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo. A Ally não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar o Serviço.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">11. Lei Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis do Brasil. Qualquer disputa relacionada a estes Termos será resolvida exclusivamente nos tribunais da comarca de São Paulo, SP.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">12. Contato</h2>
          <p>
            Se você tiver dúvidas sobre estes Termos, entre em contato conosco pelo e-mail: <a href="mailto:contato@ally.med.br" className="text-ally-blue hover:underline">contato@ally.med.br</a>.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
