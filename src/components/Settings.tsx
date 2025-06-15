import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, Palette, Info, Shield, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface User {
  id: string;
  name: string;
  email: string;
}

interface SettingsProps {
  user: User | null;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, currency, onCurrencyChange }) => {
  const { theme, toggleTheme } = useTheme();
  
  const currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (BRL)' },
    { value: 'USD', label: 'Dólar Americano (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'BTC', label: 'Bitcoin (BTC)' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências e configurações do aplicativo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações da Conta */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-foreground">{user?.name || 'Não informado'}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{user?.email || 'Não informado'}</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plano</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">Gratuito</Badge>
                <span className="text-sm text-muted-foreground">100 transações/mês</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Modo Escuro</label>
                <p className="text-xs text-muted-foreground">Alternar entre modo claro e escuro</p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
                <Moon className="w-4 h-4" />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Moeda</label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Formato de Data</label>
              <p className="text-foreground">DD/MM/AAAA</p>
            </div>
          </CardContent>
        </Card>

        {/* Sobre o Aplicativo */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Sobre o App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Versão</label>
              <p className="text-foreground">v0.3.5 Beta</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Desenvolvido por</label>
              <p className="text-foreground">System Pause Team</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
              <p className="text-foreground">Junho de 2025</p>
            </div>
          </CardContent>
        </Card>

        {/* Segurança e Privacidade */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança e Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Backup de Dados</label>
              <p className="text-foreground">Armazenamento Local</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Criptografia</label>
              <p className="text-foreground">Dados protegidos localmente</p>
            </div>
            <Separator />
            <div>
              <label className="text-sm font-medium text-muted-foreground">Política de Privacidade</label>
              <p className="text-foreground text-sm">
                Seus dados são armazenados apenas no seu dispositivo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Ajuda e Suporte */}
        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Ajuda e Suporte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Central de Ajuda</h4>
                <p className="text-sm text-muted-foreground">
                  Encontre respostas para as perguntas mais frequentes
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Contato</h4>
                <p className="text-sm text-muted-foreground">
                  Entre em contato conosco para suporte técnico
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Feedback</h4>
                <p className="text-sm text-muted-foreground">
                  Sua opinião é importante para melhorarmos o app
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
