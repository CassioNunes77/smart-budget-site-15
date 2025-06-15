import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  FileText, 
  Share2, 
  Crown,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UserProfileProps {
  user: { id: string; name: string; email: string } | null;
  onUpdateUser: (userData: { name: string; email: string }) => void;
  onShowPremiumModal?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateUser, onShowPremiumModal }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const handleSave = () => {
    if (editName.trim() && editEmail.trim()) {
      onUpdateUser({ name: editName.trim(), email: editEmail.trim() });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setIsEditing(false);
  };

  const handleShareApp = () => {
    const shareText = `Conheça o PINEE - o melhor app para controle financeiro pessoal! 💰📱`;
    
    if (navigator.share) {
      navigator.share({
        title: 'PINEE',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.origin}`);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para sua área de transferência.",
      });
    }
  };

  const openTermsOfUse = () => {
    // Simulação de abertura dos termos de uso
    toast({
      title: "Termos de Uso",
      description: "Abrindo termos de uso...",
    });
  };

  const openPrivacyPolicy = () => {
    // Simulação de abertura da política de privacidade
    toast({
      title: "Política de Privacidade",
      description: "Abrindo política de privacidade...",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais</p>
      </div>

      {/* Informações do Perfil */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email || 'usuário local'}</p>
              <Badge variant="secondary" className="mt-1">
                Usuário Gratuito
              </Badge>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled
                  className="opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado por questões de segurança
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={handleCancel} className="gap-2">
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{user?.email || 'usuário local'}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Versão Premium */}
      <Card className="shadow-lg border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Crown className="w-5 h-5" />
            PINEE Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Desbloqueie recursos avançados e tenha uma experiência completa de controle financeiro.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>Transações ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>Relatórios avançados</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>Sincronização na nuvem</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                <span>Suporte prioritário</span>
              </li>
            </ul>
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              onClick={onShowPremiumModal}
            >
              <Crown className="w-4 h-4 mr-2" />
              Atualizar para Premium
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleShareApp}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Share2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Indique para um amigo</h3>
                <p className="text-sm text-muted-foreground">Compartilhe o PINEE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={openTermsOfUse}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Termos de Uso</h3>
                <p className="text-sm text-muted-foreground">Leia nossos termos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={openPrivacyPolicy}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Política de Privacidade</h3>
                <p className="text-sm text-muted-foreground">Como protegemos seus dados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
