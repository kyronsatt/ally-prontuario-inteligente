
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppointment } from '@/context/AppointmentContext';
import { ArrowLeft } from 'lucide-react';

const NewAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { appointment, setAppointment } = useAppointment();
  
  const [appointmentType, setAppointmentType] = useState<'new' | 'return' | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'M' | 'F' | 'O'>('M');
  
  const handleContinue = () => {
    if (!patientName || !appointmentType) return;
    
    setAppointment({
      ...appointment,
      patient: {
        name: patientName,
        age: patientAge ? parseInt(patientAge) : undefined,
        gender: patientGender,
        isNew: appointmentType === 'new'
      },
      type: appointmentType
    });
    
    navigate('/app/escuta');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/app')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao painel
      </Button>
      
      <Card className="bg-white border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Novo Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Qual o tipo de atendimento?</h3>
            
            <RadioGroup
              value={appointmentType || ''}
              onValueChange={(value: 'new' | 'return') => setAppointmentType(value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer flex-1">Paciente Novo</Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="return" id="return" />
                <Label htmlFor="return" className="cursor-pointer flex-1">Retorno de Paciente</Label>
              </div>
            </RadioGroup>
          </div>
          
          {appointmentType && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">
                {appointmentType === 'new' 
                  ? 'Informações do novo paciente' 
                  : 'Buscar paciente'
                }
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome do paciente</Label>
                  <Input 
                    id="name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Nome completo"
                  />
                </div>
                
                {appointmentType === 'new' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Idade"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="gender">Gênero</Label>
                      <select
                        id="gender"
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as 'M' | 'F' | 'O')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="O">Outro</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="justify-end pt-4">
          <Button 
            disabled={!patientName || !appointmentType}
            onClick={handleContinue}
            className="w-full sm:w-auto bg-ally-blue hover:bg-ally-blue/90"
            size="lg"
          >
            Iniciar Escuta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewAppointment;
