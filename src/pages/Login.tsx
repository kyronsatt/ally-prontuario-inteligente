import { FormEvent, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Checkbox } from "@/components/ui/checkbox";
import { useStandardizedToast } from "@/hooks/use-standardized-toast";

const Login = () => {
  const { session, signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    specialty: "",
    crm: "",
    agreeToTerms: true,
  });
  const { trackPageView, trackEvent } = useAnalytics();
  const toast = useStandardizedToast();

  useEffect(() => {
    trackPageView("login_page");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeToTerms: checked,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          throw error;
        }
        trackEvent("login_success", { email: formData.email });
      } else {
        // Register mode
        if (formData.password !== formData.confirmPassword) {
          toast.error("As senhas não correspondem", "Erro de senha");
          return;
        }

        if (!formData.agreeToTerms) {
          toast.error(
            "Você precisa concordar com os termos de uso para se registrar",
            "Termos de uso"
          );
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          specialty: formData.specialty,
          crm: formData.crm,
        });

        if (error) {
          throw error;
        }

        toast.success(
          "Sua conta foi criada. Por favor, verifique seu e-mail para confirmar o registro.",
          "Registro bem-sucedido"
        );

        trackEvent("register_success", { email: formData.email });
        setMode("login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(String(error.message), "Erro de autenticação");
      trackEvent("authentication_error", { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // If user is already authenticated, redirect to dashboard
  if (session) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login/Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <AllyLogo className="h-10 mb-12" />
            <h1 className="text-3xl font-semibold mb-2">
              {mode === "login" ? "Bem-vindo(a) de volta" : "Criar sua conta"}
            </h1>
            <p className="text-gray-600">
              {mode === "login"
                ? "Faça login para acessar sua conta"
                : "Preencha os campos abaixo para se registrar"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {mode === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        Nome
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        Sobrenome
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="specialty"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        Especialidade
                      </label>
                      <Input
                        id="specialty"
                        name="specialty"
                        type="text"
                        value={formData.specialty}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="crm"
                        className="text-sm font-medium text-gray-700 block"
                      >
                        CRM
                      </label>
                      <Input
                        id="crm"
                        name="crm"
                        type="text"
                        value={formData.crm}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {mode === "register" && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 block"
                    >
                      Confirmar Senha
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-none text-gray-700"
                    >
                      Eu concordo com os{" "}
                      <Link
                        to="/termos-de-uso"
                        className="text-ally-blue hover:underline"
                      >
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link
                        to="/politica-privacidade"
                        className="text-ally-blue hover:underline"
                      >
                        Política de Privacidade
                      </Link>
                    </label>
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-ally-blue hover:bg-ally-blue/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aguarde...
                </>
              ) : mode === "login" ? (
                "Entrar"
              ) : (
                "Criar conta"
              )}
            </Button>

            <div className="text-center text-sm mt-6">
              {mode === "login" ? (
                <p className="text-gray-600">
                  Ainda não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-ally-blue hover:underline font-medium"
                  >
                    Registrar-se
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-ally-blue hover:underline font-medium"
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(26,209,255,0.6), rgba(0,230,230,0.6)), url('/assets/images/female-doctor-3.jpg')",
        }}
      ></div>
    </div>
  );
};

export default Login;
