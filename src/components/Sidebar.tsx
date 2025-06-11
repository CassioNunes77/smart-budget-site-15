import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  X,
  DollarSign,
  User,
  Tag,
  Crown,
  Bell
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  userName: string;
  onShowPremiumModal: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    id: 'dashboard'
  },
  {
    title: 'Transações',
    icon: Receipt,
    id: 'transactions'
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    id: 'reports'
  },
  {
    title: 'Notificações',
    icon: Bell,
    id: 'notifications'
  },
  {
    title: 'Perfil',
    icon: User,
    id: 'profile'
  },
  {
    title: 'Categorias',
    icon: Tag,
    id: 'categories'
  },
  {
    title: 'Configurações',
    icon: Settings,
    id: 'settings'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout, userName, onShowPremiumModal }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePageChange = (page: string) => {
    onPageChange(page);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-sidebar-foreground">Fluxo Fácil</h1>
                  <p className="text-xs text-sidebar-foreground/60">v0.1.5</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {userName}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  Usuário Gratuito
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 h-11 ${
                  currentPage === item.id 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
                onClick={() => {
                  onPageChange(item.id);
                  setIsSidebarOpen(false);
                }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
                {item.id === 'notifications' && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            ))}
          </nav>

          {/* Premium banner */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-sidebar-foreground">Premium</span>
              </div>
              <p className="text-xs text-sidebar-foreground/70 mb-3">
                Desbloqueie recursos avançados
              </p>
              <Button size="sm" className="w-full premium-button text-xs" onClick={onShowPremiumModal}>
                Atualizar
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-60 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  );
};

export default Sidebar;
