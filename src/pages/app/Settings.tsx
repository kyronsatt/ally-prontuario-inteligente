
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>
      
      <div className="grid gap-8">
        {/* Perfil do usuário */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Perfil de usuário</CardTitle>
            <User className="h-5 w-5 text-ally-gray" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{user?.email}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm font-medium text-gray-500">ID de usuário</p>
                <p className="text-sm text-gray-600 break-all">{user?.id}</p>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <div className={`h-3 w-3 rounded-full ${user?.email_confirmed_at ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {user?.email_confirmed_at 
                    ? 'Email verificado' 
                    : 'Email não verificado'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Opção de logout */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-medium">Sessão</CardTitle>
            <LogOut className="h-5 w-5 text-ally-gray" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ao sair, você precisará fazer login novamente para acessar o aplicativo.
            </p>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Saindo..." : "Sair da conta"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
