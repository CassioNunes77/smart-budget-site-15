
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertCircle, CheckCircle, TrendingUp, Shield, Users, Zap, Star } from 'lucide-react';
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

  const benefits = [
    { icon: TrendingUp, text: "Aumente sua renda em até 40% no primeiro ano" },
    { icon: Shield, text: "Seus dados protegidos com segurança bancária" },
    { icon: Zap, text: "Economize 5 horas por semana em controle financeiro" },
    { icon: Users, text: "Junte-se a mais de 50.000 usuários satisfeitos" }
  ];

  const testimonials = [
    { name: "Maria Silva", role: "Empresária", text: "Consegui organizar minhas finanças e aumentar meus lucros em 35%!", rating: 5 },
    { name: "João Santos", role: "Freelancer", text: "Nunca pensei que controlar dinheiro poderia ser tão simples.", rating: 5 },
    { name: "Ana Costa", role: "Consultora", text: "Recomendo para todos os meus clientes. Mudou minha vida!", rating: 5 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-auto">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            <Star className="w-4 h-4" />
            Oferta por tempo limitado - 30 dias grátis!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transforme Sua Vida
            <span className="text-yellow-400 block">Financeira em 30 Dias</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubra o método usado por milhares de pessoas para sair do vermelho, 
            construir riqueza e conquistar a liberdade financeira que sempre sonharam
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">
                Por que 50.000+ pessoas escolheram o Fluxo Fácil?
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <div className="bg-green-500 p-2 rounded-full">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Veja o que nossos usuários estão dizendo
              </h3>
              
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white mb-2 italic">"{testimonial.text}"</p>
                    <div className="text-blue-200 text-sm">
                      <strong>{testimonial.name}</strong> - {testimonial.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency Element */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">
                ⚡ Apenas hoje: Acesso Premium GRÁTIS por 30 dias
              </h3>
              <p className="text-white/90 text-sm">
                Não perca esta oportunidade única. Milhares já transformaram suas vidas!
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="lg:sticky lg:top-8">
            <Card className="w-full shadow-2xl bg-white/95 backdrop-blur-sm border-0">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Comece Agora - É Grátis!
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Junte-se a milhares de pessoas que já transformaram suas finanças
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Value Proposition */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Garantia de 30 dias</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Teste sem riscos. Se não ficar satisfeito, devolvemos seu tempo investido!
                  </p>
                </div>

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
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? 'Entrando na sua nova vida...' : 'COMEÇAR TRANSFORMAÇÃO GRÁTIS'}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    🔒 Seus dados estão 100% seguros conosco
                  </p>
                  <p className="text-xs text-gray-400">
                    Ao continuar, você concorda em mudar sua vida financeira para melhor
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex justify-center items-center gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-blue-600">50K+</div>
                    <div className="text-xs text-gray-500">Usuários Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-green-600">98%</div>
                    <div className="text-xs text-gray-500">Satisfação</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-purple-600">4.9★</div>
                    <div className="text-xs text-gray-500">Avaliação</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16 pb-8">
          <p className="text-blue-100 text-lg mb-4">
            "O melhor momento para começar foi há 10 anos. O segundo melhor momento é agora."
          </p>
          <p className="text-blue-200 text-sm">
            Não deixe para amanhã a transformação que pode começar hoje.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
