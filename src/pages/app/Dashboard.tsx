
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, History } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const doctorName = "Silva"; // Em uma aplicação real, viria da autenticação
  
  // Estatísticas fictícias para demonstração
  const stats = [
    { label: 'Atendimentos hoje', value: 8 },
    { label: 'Pacientes novos', value: 3 },
    { label: 'Tempo economizado', value: '2h30m' },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        Bem-vindo(a), Dr(a). {doctorName}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <Button
          onClick={() => navigate('/app/novo-atendimento')}
          size="lg"
          className="h-24 text-xl flex items-center justify-center gap-3"
        >
          <Plus className="h-6 w-6" />
          Novo Atendimento
        </Button>
        
        <Button
          onClick={() => navigate('/app/historico')}
          variant="secondary"
          size="lg"
          className="h-24 text-xl flex items-center justify-center gap-3"
        >
          <History className="h-6 w-6" />
          Histórico de Atendimentos
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-none shadow-sm">
            <CardContent className="pt-6 flex flex-col items-center">
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-semibold text-ally-blue mt-2">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
