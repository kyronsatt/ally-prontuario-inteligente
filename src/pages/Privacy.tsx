
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { useAnalytics } from '@/hooks/use-analytics';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    document.title = "Política de Privacidade | Ally";
    trackPageView('privacy_policy_page');
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
          <h1 className="text-3xl font-bold mb-8 text-center">Política de Privacidade</h1>
          
          <p className="text-gray-600 mb-6">Última atualização: 06 de Maio de 2025</p>
          
          <p className="mb-6">
            Esta Política de Privacidade descreve como a Ally Medical Technologies ("Ally", "nós", "nosso" ou "nossa") coleta, usa, armazena e compartilha os dados pessoais quando você utiliza nossa plataforma de anamnese estruturada ("Serviço"). Ao utilizar nosso Serviço, você concorda com a coleta e uso de informações de acordo com esta política.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Dados que Coletamos</h2>
          <p>Coletamos os seguintes tipos de informações:</p>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.1. Informações do Profissional de Saúde</h3>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Nome completo</li>
            <li>Endereço de e-mail profissional</li>
            <li>Número de registro profissional (CRM)</li>
            <li>Especialidade médica</li>
            <li>Informações de contato</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.2. Informações de Pacientes</h3>
          <p>
            Como profissional de saúde, você insere dados de seus pacientes em nossa plataforma, que podem incluir:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Nome e outros dados de identificação</li>
            <li>Data de nascimento e idade</li>
            <li>Gênero</li>
            <li>Histórico médico</li>
            <li>Informações sobre consultas e atendimentos</li>
            <li>Transcrições de consultas</li>
            <li>Relatórios médicos gerados</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-2">1.3. Dados de Uso</h3>
          <ul className="list-disc pl-6 mt-2 mb-4">
            <li>Informações sobre como você acessa e usa nosso Serviço</li>
            <li>Endereço IP</li>
            <li>Tipo de navegador</li>
            <li>Páginas visitadas</li>
            <li>Data e hora do acesso</li>
            <li>Tempo gasto no Serviço</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Como Usamos os Dados</h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul className="list-disc pl-6 mt-2 mb-6">
            <li>Fornecer e manter nosso Serviço</li>
            <li>Notificá-lo sobre alterações em nosso Serviço</li>
            <li>Permitir que você participe de recursos interativos de nosso Serviço</li>
            <li>Fornecer suporte ao cliente</li>
            <li>Coletar análises para melhorar nosso Serviço</li>
            <li>Monitorar o uso do Serviço</li>
            <li>Detectar, prevenir e resolver problemas técnicos</li>
            <li>Processar e gerar relatórios médicos conforme solicitado</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Base Legal para Processamento</h2>
          <p>Processamos seus dados pessoais com base nas seguintes justificativas legais:</p>
          <ul className="list-disc pl-6 mt-2 mb-6">
            <li>Execução do contrato de serviços</li>
            <li>Seu consentimento, quando aplicável</li>
            <li>Nossos interesses legítimos, desde que não prevaleçam sobre seus direitos e liberdades</li>
            <li>Cumprimento de obrigações legais</li>
          </ul>
          
          <p>
            Para dados de saúde dos pacientes, você, como profissional de saúde, é o controlador desses dados e deve obter o consentimento adequado dos pacientes antes de inserir suas informações em nossa plataforma.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Compartilhamento de Dados</h2>
          <p>Podemos compartilhar seus dados pessoais nas seguintes situações:</p>
          <ul className="list-disc pl-6 mt-2 mb-6">
            <li>Com prestadores de serviços que utilizamos para suportar nosso Serviço</li>
            <li>Para cumprir com uma obrigação legal</li>
            <li>Para proteger e defender nossos direitos ou propriedade</li>
            <li>Para prevenir ou investigar possíveis irregularidades relacionadas ao Serviço</li>
            <li>Para proteger a segurança pessoal dos usuários do Serviço ou do público</li>
            <li>Para proteger contra responsabilidade legal</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Segurança dos Dados</h2>
          <p>
            A segurança dos seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela internet ou método de armazenamento eletrônico é 100% seguro. Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger seus dados pessoais, incluindo:
          </p>
          <ul className="list-disc pl-6 mt-2 mb-6">
            <li>Criptografia de dados em trânsito e em repouso</li>
            <li>Controles de acesso rigorosos</li>
            <li>Monitoramento contínuo de segurança</li>
            <li>Treinamento regular de segurança para nossa equipe</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Retenção de Dados</h2>
          <p>
            Retemos seus dados pessoais apenas pelo tempo necessário para os propósitos estabelecidos nesta Política de Privacidade. No caso dos dados de pacientes, seguimos os prazos de retenção estabelecidos pela legislação aplicável para registros médicos.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Seus Direitos de Privacidade</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:</p>
          <ul className="list-disc pl-6 mt-2 mb-6">
            <li>Direito de acesso aos seus dados pessoais</li>
            <li>Direito de retificação de dados incompletos, inexatos ou desatualizados</li>
            <li>Direito à exclusão dos dados</li>
            <li>Direito à portabilidade dos dados</li>
            <li>Direito de revogar o consentimento</li>
          </ul>
          
          <p>
            Para exercer esses direitos, entre em contato conosco através do e-mail <a href="mailto:privacidade@ally.med.br" className="text-ally-blue hover:underline">privacidade@ally.med.br</a>.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Transferências Internacionais de Dados</h2>
          <p>
            Seus dados podem ser transferidos e mantidos em computadores localizados fora do seu estado, província, país ou outra jurisdição governamental, onde as leis de proteção de dados podem ser diferentes. Garantimos que qualquer transferência internacional de dados seja realizada em conformidade com a legislação aplicável.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Alterações a esta Política de Privacidade</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página e atualizando a data de "última atualização" no topo.
          </p>
          <p>
            Recomendamos que você revise esta Política de Privacidade periodicamente para verificar se houve alterações. Mudanças nesta Política de Privacidade são efetivas quando publicadas nesta página.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
          </p>
          <ul className="list-none mt-2 mb-6">
            <li>Por e-mail: <a href="mailto:privacidade@ally.med.br" className="text-ally-blue hover:underline">privacidade@ally.med.br</a></li>
            <li>Por correspondência: Ally Medical Technologies, Av. Paulista, 1000, São Paulo, SP - Brasil</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
