import React, { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/use-analytics";

const WaitlistForm: React.FC = () => {
  const { trackEvent, trackFormSubmit, trackButtonClick } = useAnalytics();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialty: "",
    phone_number: "",
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Track form field interaction
    trackEvent("form_field_change", {
      form_name: "waitlist",
      field_name: name,
    });

    // Limpar erro quando o usuário começa a digitar novamente
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Por favor, informe seu nome completo.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Por favor, informe seu e-mail profissional.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor, informe um e-mail válido.");
      return false;
    }

    if (!formData.specialty) {
      setError("Por favor, selecione sua especialidade médica.");
      return false;
    }

    if (!formData.phone_number) {
      setError("Por favor, informe um telefone para contato.");
      return false;
    }

    if (!formData.acceptTerms) {
      setError(
        "Você precisa aceitar os termos de uso e política de privacidade para continuar."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      trackFormSubmit("waitlist", "error", { error: error });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Track form submission attempt
      trackEvent("waitlist_form_submit", {
        specialty: formData.specialty,
      });

      // Inserindo dados na tabela waitlist do Supabase
      const { error: supabaseError } = await supabase.from("waitlist").insert([
        {
          name: formData.name,
          email: formData.email,
          specialty: formData.specialty || null,
          phone_number: formData.phone_number,
        },
      ]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);

      // Track successful submission
      trackFormSubmit("waitlist", "success", {
        specialty: formData.specialty,
      });

      setFormData({
        name: "",
        email: "",
        specialty: "",
        phone_number: "",
        acceptTerms: false,
      });
    } catch (err) {
      console.error("Erro ao agendar demonstração:", err);

      // Track form error
      trackFormSubmit("waitlist", "error", {
        error: err instanceof Error ? err.message : "Unknown error",
      });

      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao processar seu agendamento."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    trackButtonClick("waitlist_form_reset");
  };

  return (
    <section id="waitlist" className="section-spacing bg-gray-50">
      <div className="container-ally">
        <div className="max-w-xl mx-auto">
          <div
            className="text-center mb-10 fade-in-section"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <h2 className="heading-lg mb-4">
              Transforme sua prática clínica{" "}
              <span className="gradient-text">hoje mesmo</span>
            </h2>
            <p className="text-lg text-ally-gray">
              Agende uma demonstração exclusiva e descubra como a Ally pode
              revolucionar suas consultas.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 fade-in-section"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-ally-dark mb-1"
                  >
                    Nome completo
                  </label>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ally-dark mb-1"
                  >
                    E-mail profissional
                  </label>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-ally-dark mb-1"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label
                    htmlFor="specialty"
                    className="block text-sm font-medium text-ally-dark mb-1"
                  >
                    Especialidade médica
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-ally-blue focus:border-ally-blue"
                  >
                    <option value="">Selecione sua especialidade</option>
                    <option value="Anestesiologia">Anestesiologia</option>
                    <option value="Cardiologia">Cardiologia</option>
                    <option value="Cirurgia Plástica">Cirurgia Plástica</option>
                    <option value="Clínica Médica">Clínica Médica</option>
                    <option value="Coloproctologia">Coloproctologia</option>
                    <option value="Dermatologia">Dermatologia</option>
                    <option value="Endocrinologia">Endocrinologia</option>
                    <option value="Gastroenterologia">Gastroenterologia</option>
                    <option value="Geriatria">Geriatria</option>
                    <option value="Ginecologia">Ginecologia</option>
                    <option value="Neurologia">Neurologia</option>
                    <option value="Oftalmologia">Oftalmologia</option>
                    <option value="Otorrinolaringologia">
                      Otorrinolaringologia
                    </option>
                    <option value="Pediatria">Pediatria</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 mr-2"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-ally-gray"
                  >
                    Li e concordo com os{" "}
                    <a
                      href="/termo-de-uso"
                      className="text-ally-blue hover:underline"
                    >
                      Termos de Uso
                    </a>{" "}
                    e
                    <a
                      href="/politica-privacidade"
                      className="text-ally-blue hover:underline"
                    >
                      {" "}
                      Política de Privacidade
                    </a>
                    .
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center h-12 mt-4"
                  disabled={isSubmitting}
                  onClick={() => trackButtonClick("submit_waitlist")}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CalendarClock className="mr-2" size={20} />
                  )}
                  Agendar demonstração
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">
                  Demonstração agendada!
                </h3>
                <p className="text-ally-gray mb-6">
                  Em breve, entraremos em contato para confirmar os detalhes da
                  sua demonstração exclusiva da Ally.
                </p>
                <button
                  onClick={handleReset}
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
