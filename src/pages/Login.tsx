
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const authSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Login = () => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');
  const navigate = useNavigate();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);
    
    try {
      if (activeTab === 'login') {
        const { error } = await signIn(data.email, data.password);
        if (error) throw error;
        
        toast.success('Login realizado com sucesso');
        navigate('/app');
      } else {
        const { error } = await signUp(data.email, data.password);
        if (error) throw error;
        
        toast.success('Cadastro realizado com sucesso', {
          description: 'Verifique seu email para confirmar o cadastro.',
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Falha na autenticação', {
        description: error?.message || 'Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="text-ally-dark font-semibold text-3xl">
            <span className="gradient-text">Ally</span>
          </a>
          <p className="mt-2 text-gray-600">Sua plataforma de atendimento inteligente</p>
        </div>
        
        <Card className="bg-white shadow-lg border-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {activeTab === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' ? 'Digite suas credenciais para continuar' : 'Preencha seus dados para se cadastrar'}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastre-se</TabsTrigger>
              </TabsList>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
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
                    {isLoading ? 'Processando...' : activeTab === 'login' ? 'Entrar' : 'Cadastrar'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
