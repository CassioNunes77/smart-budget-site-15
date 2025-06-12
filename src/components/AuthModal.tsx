
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthModalProps {
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleGoogleLogin, error } = useFirebaseAuth();

  const handleFirebaseGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await handleGoogleLogin();
      console.log('Login iniciado, aguardando callback do Firebase...');
    } catch (error) {
      console.error('Erro capturado no componente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl bg-white/95 backdrop-blur-sm border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Financeiro Simples</CardTitle>
            <p className="text-gray-600 mt-2">Controle suas finanças com simplicidade</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleFirebaseGoogleLogin} 
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
            size="lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Entrando...' : 'Login com Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Faça login com sua conta Google para acessar o sistema
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
