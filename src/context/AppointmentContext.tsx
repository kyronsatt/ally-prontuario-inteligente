
import React, { createContext, useContext, useState } from 'react';

interface Patient {
  id?: string;
  name: string;
  age?: number;
  gender?: 'M' | 'F' | 'O';
  isNew: boolean;
}

interface AppointmentData {
  patient: Patient | null;
  type: 'new' | 'return' | null;
  date: Date | null;
  selectedFormat: 'soap' | 'anamnese' | string;
  soapNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  anamneseNote?: {
    queixaPrincipal?: string;
    historiaDoencaAtual?: string;
    antecedentesPatologicos?: string;
    medicacoesEmUso?: string;
    habitosDeVida?: string;
    examesComplementares?: string;
    examesFisicos?: string;
    diagnostico?: string;
    conduta?: string;
  };
}

interface AppointmentContextType {
  appointment: AppointmentData;
  setAppointment: React.Dispatch<React.SetStateAction<AppointmentData>>;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetAppointment: () => void;
}

const defaultAppointment: AppointmentData = {
  patient: null,
  type: null,
  date: null,
  selectedFormat: 'soap',
  soapNote: {
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  },
  anamneseNote: {
    queixaPrincipal: '',
    historiaDoencaAtual: '',
    antecedentesPatologicos: '',
    medicacoesEmUso: '',
    habitosDeVida: '',
    examesFisicos: '',
    examesComplementares: '',
    diagnostico: '',
    conduta: ''
  }
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointment, setAppointment] = useState<AppointmentData>(defaultAppointment);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
    // Em uma aplicação real, aqui teríamos a lógica para processar o áudio
    // e gerar o prontuário SOAP usando a AI
    
    // Simulação de dados do SOAP para demonstração
    setAppointment(prev => ({
      ...prev,
      date: new Date(),
      soapNote: {
        subjective: 'Paciente relata dores de cabeça frequentes nas últimas duas semanas, principalmente na região frontal. Dor pulsátil de intensidade moderada, pior no período da tarde.',
        objective: 'Pressão arterial 120/80 mmHg. Temperatura 36.5°C. Exame neurológico sem alterações significativas. Leve tensão muscular na região cervical.',
        assessment: 'Cefaleia tensional relacionada provavelmente com estresse no trabalho e postura inadequada.',
        plan: 'Dipirona 500mg em caso de dor intensa. Orientação para melhorar ergonomia no trabalho. Técnicas de relaxamento. Retorno em 2 semanas se não houver melhora.'
      },
      anamneseNote: {
        queixaPrincipal: 'Dores de cabeça frequentes há duas semanas',
        historiaDoencaAtual: 'Paciente relata dores de cabeça frequentes nas últimas duas semanas, principalmente na região frontal. Dor pulsátil de intensidade moderada, pior no período da tarde. Relata aumento do estresse no trabalho no mesmo período.',
        antecedentesPatologicos: 'Nega hipertensão, diabetes ou outras comorbidades. Relata episódios prévios de enxaqueca na adolescência.',
        medicacoesEmUso: 'Nega uso contínuo de medicações. Uso esporádico de dipirona para dor.',
        habitosDeVida: 'Sedentário, trabalha cerca de 8h por dia em frente ao computador. Sono irregular, aproximadamente 6h por noite.',
        examesFisicos: 'Pressão arterial 120/80 mmHg. Temperatura 36.5°C. Exame neurológico sem alterações significativas. Leve tensão muscular na região cervical.',
        examesComplementares: 'Sem exames complementares no momento.',
        diagnostico: 'Cefaleia tensional relacionada provavelmente com estresse no trabalho e postura inadequada.',
        conduta: 'Dipirona 500mg em caso de dor intensa. Orientação para melhorar ergonomia no trabalho. Técnicas de relaxamento. Retorno em 2 semanas se não houver melhora.'
      }
    }));
  };

  const resetAppointment = () => {
    setAppointment(defaultAppointment);
    setIsListening(false);
  };

  return (
    <AppointmentContext.Provider 
      value={{ 
        appointment, 
        setAppointment, 
        isListening, 
        startListening, 
        stopListening,
        resetAppointment
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
