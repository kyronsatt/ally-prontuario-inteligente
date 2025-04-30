
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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
  soap_subjective: string | null;
  soap_objective: string | null;
  soap_assessment: string | null;
  soap_plan: string | null;
  patients: Patient;
}

const AppointmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get selected appointment ID from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const selectedAppointmentId = queryParams.get('id');
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-appointments', {
          body: { search: searchTerm }
        });
        
        if (error) {
          throw new Error(`Error invoking function: ${error.message}`);
        }
        
        setAppointments(data.appointments || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
        toast.error('Erro ao carregar histórico de atendimentos');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [searchTerm]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewDetails = (id: string) => {
    // In a real app, navigate to appointment details 
    console.log(`Viewing details for appointment ${id}`);
    navigate(`/app/historico?id=${id}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(app =>
    app.patients.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/app')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>
      
      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl">Histórico de Atendimentos</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Buscar paciente por nome..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="space-y-4 mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-ally-blue" />
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <p>Erro ao carregar os atendimentos.</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline" 
                  className="mt-2"
                >
                  Tentar novamente
                </Button>
              </div>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedAppointmentId === appointment.id ? 'border-ally-blue bg-blue-50' : ''
                  }`}
                  onClick={() => handleViewDetails(appointment.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.patients.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {appointment.soap_subjective 
                          ? appointment.soap_subjective.substring(0, 100) + (appointment.soap_subjective.length > 100 ? '...' : '') 
                          : 'Sem queixa registrada'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(appointment.date)}
                      </div>
                      
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
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum atendimento encontrado com esse nome.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentHistory;
