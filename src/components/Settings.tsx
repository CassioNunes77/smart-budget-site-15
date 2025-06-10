
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Settings as SettingsIcon, User, Shield } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface SettingsProps {
  user: { name: string; email: string } | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Personalize sua experiência</p>
      </div>

      {/* Tema */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-blue-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
              <div>
                <Label htmlFor="theme-toggle" className="text-sm font-medium">
                  Modo Escuro
                </Label>
                <p className="text-xs text-muted-foreground">
                  Alterne entre tema claro e escuro
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Perfil do Usuário */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email || 'usuário local'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Aviso de Segurança
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
              Esta versão utiliza armazenamento local. Para maior segurança, considere fazer backup regular dos seus dados.
            </p>
            <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-900/30">
              Fazer Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sobre */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Sobre o App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Versão:</strong> 0.1.2</p>
            <p><strong>Desenvolvido com:</strong> React + TypeScript</p>
            <p><strong>Funcionalidades:</strong> Controle financeiro pessoal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
