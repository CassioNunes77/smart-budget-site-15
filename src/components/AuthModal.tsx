
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertCircle, CheckCircle, TrendingUp, Shield, Users, Zap, Star, Rocket, Target, Trophy, Clock } from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

// Importando os novos componentes
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
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 horas em segundos
  const { handleGoogleLogin, error } = useFirebaseAuth();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    { icon: TrendingUp, text: "Aumente sua renda em até 300% no primeiro ano", color: "from-green-500 to-emerald-600" },
    { icon: Shield, text: "Seus dados protegidos com criptografia militar", color: "from-blue-500 to-cyan-600" },
    { icon: Zap, text: "Economize 10+ horas por semana automaticamente", color: "from-yellow-500 to-orange-600" },
    { icon: Users, text: "Comunidade exclusiva de +100.000 membros", color: "from-purple-500 to-pink-600" }
  ];

  const features = [
    { icon: Rocket, title: "IA Avançada", description: "Inteligência artificial que aprende seus padrões e otimiza automaticamente suas finanças" },
    { icon: Target, title: "Metas Inteligentes", description: "Sistema que define e acompanha suas metas financeiras com precisão científica" },
    { icon: Trophy, title: "Resultados Garantidos", description: "Metodologia comprovada por especialistas com 98% de taxa de sucesso" },
    { icon: Clock, title: "Tempo Real", description: "Atualizações instantâneas e sincronização em todos os seus dispositivos" }
  ];

  const testimonials = [
    { 
      name: "Maria Silva", 
      role: "Empresária Digital", 
      text: "Em 6 meses consegui organizar completamente minhas finanças e aumentar meus lucros em 280%. A plataforma mudou minha vida completamente!", 
      rating: 5 
    },
    { 
      name: "João Santos", 
      role: "Consultor de TI", 
      text: "Nunca imaginei que controlar dinheiro poderia ser tão automático. Agora invisto melhor e tenho mais tempo para minha família.", 
      rating: 5 
    },
    { 
      name: "Ana Costa", 
      role: "Médica", 
      text: "Recomendo para todos os meus colegas. Em 1 ano saí de R$ 50 mil em dívidas para R$ 200 mil investidos!", 
      rating: 5 
    },
    { 
      name: "Carlos Lima", 
      role: "Engenheiro", 
      text: "A automação é incrível! O sistema faz tudo sozinho e eu só preciso acompanhar os resultados. Já paguei minha casa!", 
      rating: 5 
    }
  ];

  return (
    <>
      <ProgressBar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-auto relative">
        <FloatingElements />
        
        {/* Hero Section com Parallax */}
        <ParallaxSection className="relative z-10 container mx-auto px-4 py-8" speed={0.3}>
          <ScrollReveal direction="fade" delay={200}>
            <div className="text-center mb-16">
              {/* Contador urgência */}
              <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 text-red-100 px-6 py-3 rounded-full text-sm font-semibold mb-6 animate-pulse backdrop-blur-sm">
                <Clock className="w-4 h-4" />
                <span>OFERTA EXPIRA EM: {formatTime(timeLeft)}</span>
              </div>
              
              <ScrollReveal direction="up" delay={400}>
                <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-300 mb-8 leading-tight">
                  Transforme Sua Vida
                  <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Financeira em 30 Dias
                  </span>
                </h1>
              </ScrollReveal>
              
              <ScrollReveal direction="up" delay={600}>
                <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                  O único sistema de IA que <strong className="text-white font-bold">GARANTE</strong> sua independência financeira 
                  usando a metodologia dos milionários mais bem-sucedidos do mundo
                </p>
              </ScrollReveal>

              {/* Stats animados */}
              <ScrollReveal direction="up" delay={800}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-green-400 mb-2">
                      <AnimatedCounter end={127} suffix="K+" />
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Usuários Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-yellow-400 mb-2">
                      <AnimatedCounter end={98} suffix="%" />
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Taxa de Sucesso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2">
                      R$ <AnimatedCounter end={2} suffix="M+" />
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Economizados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2">
                      <AnimatedCounter end={4} suffix=".9★" />
                    </div>
                    <div className="text-blue-200 text-sm font-medium">Avaliação</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </ParallaxSection>

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
            
            {/* Seção de Benefits e Features */}
            <div className="space-y-12">
              
              {/* Benefits Cards */}
              <ScrollReveal direction="left" delay={1000}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center lg:text-left">
                    Por que +127.000 pessoas escolheram o Fluxo Fácil?
                  </h2>
                  
                  <div className="grid gap-4">
                    {benefits.map((benefit, index) => (
                      <ScrollReveal key={index} direction="left" delay={1200 + index * 200}>
                        <div className="flex items-center gap-4 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                          <div className={`bg-gradient-to-br ${benefit.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                            <benefit.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors">
                            {benefit.text}
                          </span>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Features Cards Interativas */}
              <ScrollReveal direction="left" delay={1800}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">
                    Tecnologia de Ponta ao Seu Alcance
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <ScrollReveal key={index} direction="up" delay={2000 + index * 150}>
                        <InteractiveCard
                          icon={feature.icon}
                          title={feature.title}
                          description={feature.description}
                        />
                      </ScrollReveal>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Testimonials Carousel */}
              <ScrollReveal direction="left" delay={2600}>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center lg:text-left">
                    Veja o que nossos usuários estão dizendo
                  </h3>
                  <TestimonialCarousel testimonials={testimonials} />
                </div>
              </ScrollReveal>

              {/* Urgency Section */}
              <ScrollReveal direction="up" delay={2800}>
                <div className="bg-gradient-to-r from-red-600/20 via-pink-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-8 border border-red-400/30 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 animate-pulse" />
                  <div className="relative z-10">
                    <h3 className="text-white font-black text-2xl mb-4">
                      🔥 APENAS HOJE: Acesso VITALÍCIO por R$ 97
                    </h3>
                    <p className="text-red-100 mb-4 text-lg">
                      <span className="line-through opacity-60">De R$ 497</span> por apenas R$ 97
                    </p>
                    <p className="text-white/90 text-sm">
                      Não perca esta oportunidade única. Mais de 1.000 pessoas se cadastraram hoje!
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Login Card - Sticky */}
            <div className="lg:sticky lg:top-8">
              <ScrollReveal direction="right" delay={1400}>
                <Card className="w-full shadow-2xl bg-white/95 backdrop-blur-md border-0 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
                  
                  <CardHeader className="text-center space-y-6 relative z-10">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <DollarSign className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-black text-gray-900 mb-2">
                        Comece Sua Transformação
                      </CardTitle>
                      <p className="text-gray-600 text-lg font-medium">
                        Junte-se a +127.000 pessoas que já mudaram de vida
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8 relative z-10">
                    {/* Value Proposition Enhanced */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        GARANTIA
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <span className="font-black text-green-800 text-lg block mb-2">
                            Garantia Incondicional de 60 dias
                          </span>
                          <p className="text-green-700 text-sm leading-relaxed">
                            Se você não aumentar sua renda em pelo menos 200% em 60 dias, 
                            devolvemos <strong>TODO</strong> seu investimento + R$ 100 pelo seu tempo!
                          </p>
                        </div>
                      </div>
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
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 text-lg font-black py-4 h-auto relative overflow-hidden group"
                      size="lg"
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <svg className="w-6 h-6 mr-3 relative z-10" viewBox="0 0 24 24">
                        <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="relative z-10">
                        {isLoading ? 'INICIANDO SUA TRANSFORMAÇÃO...' : 'COMEÇAR TRANSFORMAÇÃO GRÁTIS AGORA'}
                      </span>
                    </Button>
                    
                    <div className="text-center space-y-3">
                      <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Seus dados protegidos com criptografia militar
                      </p>
                      <p className="text-xs text-gray-400">
                        Ao continuar, você aceita mudar sua vida financeira para sempre
                      </p>
                    </div>

                    {/* Enhanced Trust Indicators */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="font-black text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={127} suffix="K+" />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Usuários Ativos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-black text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={98} suffix="%" />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Taxa Sucesso</div>
                      </div>
                      <div className="text-center">
                        <div className="font-black text-3xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          <AnimatedCounter end={4} suffix=".9★" />
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Avaliação</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* Footer CTA com Parallax */}
          <ParallaxSection speed={0.2} className="text-center mt-20 pb-16">
            <ScrollReveal direction="up" delay={3000}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Sua Transformação Começa Agora
                </h2>
                <p className="text-blue-100 text-xl mb-8 leading-relaxed">
                  "O melhor momento para começar foi há 10 anos. O segundo melhor momento é agora."
                </p>
                <p className="text-blue-200 text-lg font-medium">
                  Não deixe para amanhã a transformação que pode começar hoje.
                  <br />
                  <strong className="text-white">Sua independência financeira está a um clique de distância.</strong>
                </p>
              </div>
            </ScrollReveal>
          </ParallaxSection>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
