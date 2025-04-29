
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WaitlistForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    crm: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulando envio para API
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Em breve entraremos em contato com você.",
      });
      
      setFormData({
        name: '',
        email: '',
        specialty: '',
        crm: ''
      });
    }, 1000);
  };

  return (
    <section id="waitlist" className="section-spacing bg-gradient-to-b from-ally-light/30 to-white">
      <div className="container-ally">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 fade-in-section" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <h2 className="heading-lg mb-4">
              Junte-se à revolução <span className="gradient-text">na prática médica</span>
            </h2>
            <p className="text-lg text-ally-gray">
              Deixe seus dados e seja um dos primeiros a conhecer a Ally.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 fade-in-section" style={{ '--delay': '200ms' } as React.CSSProperties}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-ally-dark mb-1">Nome completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-ally-dark mb-1">E-mail profissional</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-ally-dark mb-1">Especialidade médica</label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                  >
                    <option value="">Selecione sua especialidade</option>
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Endocrinologia">Endocrinologia</option>
                    <option value="Gastroenterologia">Gastroenterologia</option>
                    <option value="Neurologia">Neurologia</option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="crm" className="block text-sm font-medium text-ally-dark mb-1">Número de CRM (opcional)</label>
                  <input
                    type="text"
                    id="crm"
                    name="crm"
                    value={formData.crm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                    placeholder="Ex: 12345/UF"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center h-12 mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-spin mr-2">◌</span>
                  ) : (
                    <UserPlus className="mr-2" size={20} />
                  )}
                  Quero fazer parte da lista de espera
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Obrigado!</h3>
                <p className="text-ally-gray mb-6">
                  Em breve, entraremos em contato para você experimentar a Ally em primeira mão.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-ally-blue hover:underline"
                >
                  Voltar para o formulário
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
