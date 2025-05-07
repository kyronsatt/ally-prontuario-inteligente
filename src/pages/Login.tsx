
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-standardized-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { useAnalytics } from "@/hooks/use-analytics";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  first_name: z.string().min(1, { message: "Nome é obrigatório" }),
  last_name: z.string().min(1, { message: "Sobrenome é obrigatório" }),
  birth_date: z
    .string()
    .min(1, { message: "Data de nascimento é obrigatória" }),
  city: z.string().min(1, { message: "Cidade é obrigatória" }),
  state: z.string().min(1, { message: "Estado é obrigatório" }),
  specialty: z.string().min(1, { message: "Especialidade é obrigatória" }),
  crm: z.string().min(1, { message: "CRM é obrigatório" }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "Você deve aceitar os termos de uso e política de privacidade" }),
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();
  const { trackEvent, trackPageView } = useAnalytics();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      birth_date: "",
      city: "",
      state: "",
      specialty: "",
      crm: "",
      termsAccepted: false,
    },
  });

  // Track page view when component mounts
  useState(() => {
    trackPageView("login_page");
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      trackEvent("login_attempt", { email: data.email });
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;

      trackEvent("login_success", { email: data.email });
      toast.success("Login realizado com sucesso");
      navigate("/app");
    } catch (error: any) {
      console.error(error);
      trackEvent("login_error", { 
        email: data.email, 
        error: error?.message || "Unknown error" 
      });
      toast.error("Falha na autenticação", {
        description: error?.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);

    try {
      trackEvent("register_attempt", { email: data.email });
      // Add user metadata for the profile
      const options = {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          birth_date: data.birth_date,
          city: data.city,
          state: data.state,
          specialty: data.specialty,
          crm: data.crm,
        },
      };

      const { error } = await signUp(data.email, data.password, options);
      if (error) throw error;

      trackEvent("register_success", { email: data.email });
      toast.success("Cadastro realizado com sucesso", {
        description: "Verifique seu email para confirmar o cadastro.",
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error(error);
      trackEvent("register_error", { 
        email: data.email, 
        error: error?.message || "Unknown error" 
      });
      toast.error("Falha no cadastro", {
        description: error?.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start pt-[10vw] pb-32 justify-center bg-ally-blue px-4">
      <div className="w-full max-w-lg">
        <div className="mb-16 text-accent-foreground flex flex-col items-center">
          <a href="/" className="text-ally-dark font-semibold text-3xl">
            <AllyLogo className="h-24" white />
          </a>
          <p className="mt-2 text-lg text-white">Da voz ao prontuário.</p>
        </div>

        <Card className="bg-white shadow-xl border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === "login"
                ? "Digite suas credenciais para continuar"
                : "Preencha seus dados para se cadastrar"}
            </CardDescription>
          </CardHeader>

          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="px-6 pt-8">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">
                  Cadastre-se
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              autoComplete="email"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="current-password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-ally-blue hover:bg-ally-blue/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : "Entrar"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="João"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Silva"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seuemail@exemplo.com"
                              autoComplete="email"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              autoComplete="new-password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="birth_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Nascimento</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="São Paulo"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="SP"
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Professional Info */}
                    <FormField
                      control={registerForm.control}
                      name="specialty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especialidade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Clínica Médica"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="crm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CRM</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="12345/SP"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Terms and Privacy Policy */}
                    <FormField
                      control={registerForm.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Eu aceito os{" "}
                              <Link to="/terms" className="text-ally-blue hover:underline">
                                Termos de Uso
                              </Link>{" "}
                              e{" "}
                              <Link to="/privacy" className="text-ally-blue hover:underline">
                                Política de Privacidade
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>

                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-ally-blue hover:bg-ally-blue/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : "Cadastrar"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
