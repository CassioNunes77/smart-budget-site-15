
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
  TreePine,
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
  userPhotoURL?: string;
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

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, onLogout, userName, userPhotoURL, onShowPremiumModal }) => {
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
        flex flex-col overflow-hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">PINEE</h1>
                <p className="text-xs text-sidebar-foreground/60">v0.3.5 Beta</p>
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
        <div className="p-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center overflow-hidden">
              {userPhotoURL ? (
                <img 
                  src={userPhotoURL} 
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-green-600">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
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

        {/* Navigation - Usando overflow-y-auto para permitir rolagem */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 h-11 ${
                currentPage === item.id 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50' 
                  : 'text-sidebar-foreground hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400'
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
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-sidebar-foreground">Premium</span>
            </div>
            <p className="text-xs text-sidebar-foreground/70 mb-3">
              Desbloqueie recursos avançados
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs" onClick={onShowPremiumModal}>
              Atualizar
            </Button>
          </div>
        </div>

        {/* Footer - Garantindo que seja sempre visível */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:text-green-400"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-60 bg-background/80 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-4 h-4" />
      </Button>
    </>
  );
};

export default Sidebar;
