
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Calendar } from 'lucide-react';

// Dados fictícios para demonstração
const mockAppointments = [
  {
    id: '1',
    patientName: 'Maria Silva',
    date: new Date(2025, 3, 28),
    type: 'new',
    symptoms: 'Dor de cabeça, náusea'
  },
  {
    id: '2',
    patientName: 'João Santos',
    date: new Date(2025, 3, 28),
    type: 'return',
    symptoms: 'Acompanhamento pós-cirúrgico'
  },
  {
    id: '3',
    patientName: 'Ana Oliveira',
    date: new Date(2025, 3, 27),
    type: 'new',
    symptoms: 'Dor abdominal, vômitos'
  },
  {
    id: '4',
    patientName: 'Pedro Costa',
    date: new Date(2025, 3, 26),
    type: 'return',
    symptoms: 'Controle de medicação'
  },
  {
    id: '5',
    patientName: 'Carla Mendes',
    date: new Date(2025, 3, 25),
    type: 'new',
    symptoms: 'Tontura, pressão alta'
  }
];

const AppointmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAppointments = mockAppointments.filter(app =>
    app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewDetails = (id: string) => {
    console.log(`Ver detalhes do atendimento ${id}`);
    // Em uma aplicação real, navegaríamos para a página de detalhes
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-4 mt-6">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleViewDetails(appointment.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{appointment.symptoms}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center justify-end text-sm text-gray-600 mb-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {appointment.date.toLocaleDateString()}
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
