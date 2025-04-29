
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, History, Clock, Users, BarChart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const doctorName = "Silva"; // Em uma aplicação real, viria da autenticação
  
  // Estatísticas fictícias para demonstração
  const stats = [
    { 
      label: 'Atendimentos hoje', 
      value: 8, 
      icon: <Clock className="h-6 w-6 text-ally-blue" />,
      description: 'Consultas realizadas'
    },
    { 
      label: 'Pacientes novos', 
      value: 3, 
      icon: <Users className="h-6 w-6 text-ally-blue" />,
      description: 'Primeiras consultas'
    },
    { 
      label: 'Tempo economizado', 
      value: '2h30m', 
      icon: <BarChart className="h-6 w-6 text-ally-blue" />,
      description: 'Na documentação'
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header com saudação e gradiente */}
      <div className="bg-gradient-to-r from-ally-light to-blue-50 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Bem-vindo(a), <span className="text-ally-blue">Dr(a). {doctorName}</span>
        </h1>
        <p className="text-ally-gray">O que você deseja fazer hoje?</p>
      </div>
      
      {/* Botões de ação principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button
          onClick={() => navigate('/app/novo-atendimento')}
          size="lg"
          className="h-24 text-xl flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all bg-ally-blue hover:bg-ally-blue/90"
        >
          <Plus className="h-6 w-6" />
          Novo Atendimento
        </Button>
        
        <Button
          onClick={() => navigate('/app/historico')}
          variant="secondary"
          size="lg"
          className="h-24 text-xl flex items-center justify-center gap-3 border border-gray-100 shadow-md hover:shadow-lg transition-all"
        >
          <History className="h-6 w-6" />
          Histórico de Atendimentos
        </Button>
      </div>
      
      <Separator className="my-8" />
      
      <div>
        <h2 className="text-2xl font-medium mb-6">Resumo de atividades</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="bg-white border-none shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-ally-gray text-sm">{stat.label}</p>
                    <p className="text-3xl font-semibold text-ally-dark mt-1">{stat.value}</p>
                  </div>
                  <div className="bg-ally-light p-3 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs text-ally-gray mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Seção de acesso rápido */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50 mt-8">
        <h2 className="text-lg font-medium mb-4">Acesso rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 items-center justify-center hover:bg-ally-light/50 hover:border-ally-blue/20"
            onClick={() => console.log('Documentos')}
          >
            <FileText className="h-5 w-5 text-ally-blue" />
            <span className="text-sm">Documentos</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex flex-col gap-2 items-center justify-center hover:bg-ally-light/50 hover:border-ally-blue/20"
            onClick={() => console.log('Prontuários')}
          >
            <FileText className="h-5 w-5 text-ally-blue" />
            <span className="text-sm">Prontuários</span>
          </Button>
          {/* Botões adicionais podem ser adicionados aqui no futuro */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
