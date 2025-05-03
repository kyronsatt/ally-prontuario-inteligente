
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, History, Clock, Users, FileText, TrendingUp, ChartBar, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppointmentStats {
  total_appointments: number;
  new_patients: number;
  time_saved_minutes: number;
}

interface Patient {
  id: string;
  name: string;
  gender: string | null;
  age: number | null;
  is_new: boolean;
}

interface Appointment {
  id: string;
  date: string;
  type: string;
  patients: Patient;
}

interface DashboardData {
  stats: AppointmentStats;
  recentAppointments: Appointment[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-dashboard-data');
        
        if (error) {
          throw new Error(`Error invoking function: ${error.message}`);
        }
        
        setData(data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-ally-blue mb-4" />
        <p className="text-lg text-ally-gray">Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-lg text-red-500 mb-4">Ocorreu um erro ao carregar os dados</p>
        <Button onClick={() => window.location.reload()} className="bg-ally-blue hover:bg-ally-blue/90">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Calculate productivity metrics
  const timeSaved = data?.stats?.time_saved_minutes || 0;
  const appointments = data?.stats?.total_appointments || 0;
  const newPatients = data?.stats?.new_patients || 0;
  
  // Calculate average time saved per appointment (if there are any appointments)
  const avgTimeSavedPerAppointment = appointments > 0 ? Math.round(timeSaved / appointments) : 0;
  
  // Calculate productivity improvement (assuming 15 min saved per appointment is ~25% improvement)
  const productivityImprovement = avgTimeSavedPerAppointment > 0 ? 
    Math.min(Math.round((avgTimeSavedPerAppointment / 15) * 25), 50) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header com saudação e gradiente */}
      <div className="bg-gradient-to-r from-ally-light to-blue-50 rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Bem-vindo(a), <span className="text-ally-blue">Dr(a).</span>
        </h1>
        <p className="text-ally-gray">O que você deseja fazer hoje?</p>
      </div>
      
      {/* Métricas de produtividade em destaque */}
      <div>
        <h2 className="text-2xl font-medium mb-6">Ganhos de produtividade</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="bg-white border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-green-50 p-4 border-b border-green-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-green-800">Tempo economizado</h3>
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-green-700">{timeSaved}</p>
                  <p className="text-lg text-green-600 mb-1">min</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Em média {avgTimeSavedPerAppointment} min por consulta
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800">Produtividade</h3>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-blue-700">+{productivityImprovement}%</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Aumento na eficiência do atendimento
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-none shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-purple-50 p-4 border-b border-purple-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-purple-800">Consultas realizadas</h3>
                  <ChartBar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-purple-700">{appointments}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {newPatients} novos pacientes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
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
      
      {/* Recent appointments */}
      {data?.recentAppointments && data.recentAppointments.length > 0 && (
        <div>
          <h2 className="text-2xl font-medium mb-6">Resumo de atividades</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
            <h3 className="text-lg font-medium mb-4">Atendimentos recentes</h3>
            <div className="space-y-3">
              {data.recentAppointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/app/historico?id=${appointment.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.patients.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointment.patients.gender && `${appointment.patients.gender === 'M' ? 'Masculino' : appointment.patients.gender === 'F' ? 'Feminino' : 'Outro'} • `}
                        {appointment.patients.age && `${appointment.patients.age} anos • `}
                        {appointment.patients.is_new ? 'Primeira consulta' : 'Retorno'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs text-gray-500">{formatDate(appointment.date)}</span>
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.type === 'new' 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {appointment.type === 'new' ? 'Novo' : 'Retorno'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
