
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, BellOff, Settings, Lightbulb, Mail, Smartphone, Globe } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const NotificationsPage: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useLocalStorage('email-notifications', true);
  const [pushNotifications, setPushNotifications] = useLocalStorage('push-notifications', true);
  const [dashboardTips, setDashboardTips] = useLocalStorage('dashboard-tips-visible', true);
  const [weeklyReports, setWeeklyReports] = useLocalStorage('weekly-reports', false);
  const [transactionAlerts, setTransactionAlerts] = useLocalStorage('transaction-alerts', true);

  const notifications = [
    {
      id: 1,
      title: "Bem-vindo ao PINEE!",
      description: "Sua conta foi criada com sucesso. Comece adicionando suas primeiras transações.",
      time: "2 horas atrás",
      read: false,
      type: "welcome"
    },
    {
      id: 2,
      title: "Dica: Organize suas categorias",
      description: "Use categorias personalizadas para ter melhor controle de seus gastos.",
      time: "1 dia atrás",
      read: true,
      type: "tip"
    },
    {
      id: 3,
      title: "Transação adicionada",
      description: "Nova despesa de R$ 150,00 foi registrada na categoria 'Alimentação'.",
      time: "2 dias atrás",
      read: true,
      type: "transaction"
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      case 'transaction':
        return <Bell className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Notificações</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas preferências de notificação</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Notificação */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Notificações por Email</label>
                <p className="text-xs text-muted-foreground">Receba atualizações por email</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Notificações Push</label>
                <p className="text-xs text-muted-foreground">Alertas no navegador</p>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Dicas no Dashboard</label>
                <p className="text-xs text-muted-foreground">Mostrar dicas para usuários iniciantes</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                <Switch 
                  checked={dashboardTips} 
                  onCheckedChange={setDashboardTips}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Relatórios Semanais</label>
                <p className="text-xs text-muted-foreground">Resumo semanal por email</p>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Switch 
                  checked={weeklyReports} 
                  onCheckedChange={setWeeklyReports}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Alertas de Transação</label>
                <p className="text-xs text-muted-foreground">Notificar sobre novas transações</p>
              </div>
              <Switch 
                checked={transactionAlerts} 
                onCheckedChange={setTransactionAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Histórico de Notificações */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recentes
              </CardTitle>
              <Button variant="ghost" size="sm">
                <BellOff className="w-4 h-4 mr-2" />
                Marcar como lidas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read 
                    ? 'bg-background border-border' 
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage;
