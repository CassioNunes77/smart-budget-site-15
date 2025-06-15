
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TreePine, AlertCircle, Shield, TrendingUp, Users, Star, CheckCircle, Clock, Zap } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import AnimatedCounter from './landing/AnimatedCounter';
import ScrollReveal from './landing/ScrollReveal';
import ParallaxSection from './landing/ParallaxSection';
import InteractiveCard from './landing/InteractiveCard';
import FloatingElements from './landing/FloatingElements';
import ProgressBar from './landing/ProgressBar';
import TestimonialCarousel from './landing/TestimonialCarousel';

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
  const [scrollY, setScrollY] = useState(0);
  const { handleGoogleLogin, error } = useFirebaseAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden">
      {/* Elementos flutuantes de fundo */}
      <FloatingElements />
      
      {/* Gradiente dinâmico de fundo */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 - scrollY * 0.05}%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Header com logo e navegação */}
      <header className="relative z-20 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">PINEE</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-green-100">
            <span className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">100% Seguro</span>
            </span>
            <span className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">50K+ Usuários</span>
            </span>
          </div>
        </nav>
      </header>

      {/* Hero Section - Seção Principal */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Coluna Esquerda - Conteúdo Principal */}
            <div className="space-y-8">
              <ScrollReveal direction="up" delay={200}>
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                    <Zap className="w-4 h-4 text-green-300" />
                    <span className="text-green-100 text-sm font-medium">Controle Financeiro Inteligente</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    Transforme suas
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 block">
                      Finanças Hoje
                    </span>
                  </h1>
                  
                  <p className="text-xl text-green-100 leading-relaxed max-w-lg">
                    Junte-se a milhares de pessoas que já transformaram suas finanças com o PINEE. 
                    <strong className="text-green-300"> Controle inteligente, resultados reais.</strong>
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={400}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-green-100">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Configuração em menos de 2 minutos</span>
                  </div>
                  <div className="flex items-center space-x-3 text-green-100">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Dados 100% seguros e criptografados</span>
                  </div>
                  <div className="flex items-center space-x-3 text-green-100">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Suporte especializado incluso</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Estatísticas Animadas */}
              <ScrollReveal direction="up" delay={600}>
                <div className="grid grid-cols-3 gap-6 py-8">
                  <div className="text-center">
                    <AnimatedCounter end={50} suffix="K+" />
                    <p className="text-green-200 text-sm mt-1">Usuários Ativos</p>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter end={98} suffix="%" />
                    <p className="text-green-200 text-sm mt-1">Satisfação</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <AnimatedCounter end={4.9} />
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <p className="text-green-200 text-sm mt-1">Avaliação</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Coluna Direita - Card de Login */}
            <div className="flex justify-center lg:justify-end">
              <ScrollReveal direction="right" delay={300}>
                <InteractiveCard className="w-full max-w-md">
                  <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-8">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <TreePine className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Comece Agora</CardTitle>
                        <p className="text-green-600 font-medium mt-2">É Grátis!</p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 px-8 pb-8">
                      {/* Urgência e Escassez */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-800">Oferta Especial</span>
                        </div>
                        <p className="text-xs text-green-700">
                          Primeiros 1000 usuários ganham <strong>consultoria grátis</strong>
                        </p>
                        <ProgressBar progress={87} color="bg-green-500" />
                        <p className="text-xs text-green-600 mt-1">Restam apenas 130 vagas</p>
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
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        size="lg"
                      >
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLoading ? 'Entrando...' : 'Começar Gratuitamente'}
                      </Button>
                      
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span>Seus dados estão 100% seguros conosco</span>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Ao continuar, você concorda em 
                          <span className="text-green-600 font-medium"> mudar sua vida financeira para melhor</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </InteractiveCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por que escolher o PINEE?
              </h2>
              <p className="text-green-200 text-lg max-w-2xl mx-auto">
                Recursos desenvolvidos especialmente para transformar sua relação com o dinheiro
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal direction="up" delay={300}>
              <InteractiveCard>
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-green-300/20 h-full">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Controle Inteligente</h3>
                  <p className="text-green-200 leading-relaxed">
                    Algoritmos avançados analisam seus gastos e sugerem otimizações personalizadas para seu perfil.
                  </p>
                </div>
              </InteractiveCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={500}>
              <InteractiveCard>
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-green-300/20 h-full">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Segurança Total</h3>
                  <p className="text-green-200 leading-relaxed">
                    Criptografia de nível bancário protege todos os seus dados. Sua privacidade é nossa prioridade.
                  </p>
                </div>
              </InteractiveCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={700}>
              <InteractiveCard>
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-green-300/20 h-full">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Comunidade Ativa</h3>
                  <p className="text-green-200 leading-relaxed">
                    Faça parte de uma comunidade engajada de pessoas transformando suas finanças todos os dias.
                  </p>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Seção de Testimoniais */}
      <section className="relative z-10 py-20 px-6">
        <ParallaxSection speed={0.3}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={200}>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  O que nossos usuários dizem
                </h2>
                <p className="text-green-200 text-lg">
                  Histórias reais de transformação financeira
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <TestimonialCarousel />
            </ScrollReveal>
          </div>
        </ParallaxSection>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="up" delay={200}>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm p-12 rounded-3xl border border-green-300/30">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Sua transformação financeira começa agora
              </h2>
              <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
                Não deixe para amanhã o que pode mudar sua vida hoje. 
                Milhares já começaram, e você?
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleFirebaseGoogleLogin}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? 'Carregando...' : 'Começar Minha Transformação'}
                </Button>
                
                <p className="text-green-300 text-sm">
                  ✨ Teste sem riscos. Se não ficar satisfeito, devolvemos seu tempo investido!
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AuthModal;
