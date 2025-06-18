
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Edit3, 
  Save, 
  X, 
  Key,
  Calendar,
  Users,
  RefreshCw
} from 'lucide-react';
import planService, { UserPlan, AccountType, PaymentStatus } from '@/services/planService';
import { toast } from '@/hooks/use-toast';

const AdminPlanPanel: React.FC = () => {
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<AccountType | 'all'>('all');
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<UserPlan>>({});

  useEffect(() => {
    loadPlans();
  }, [accountTypeFilter]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      
      const filters: [string, any, any][] = [];
      if (accountTypeFilter !== 'all') {
        filters.push(['accountType', '==', accountTypeFilter]);
      }

      const plansList = await planService.listAllPlans(filters);
      setPlans(plansList);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => 
    searchTerm === '' || 
    plan.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.licenseKey?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (plan: UserPlan) => {
    setEditingPlan(plan.id);
    setEditData({
      accountType: plan.accountType,
      paymentStatus: plan.paymentStatus,
      expirationDate: plan.expirationDate,
      maxUsers: plan.maxUsers,
      contractDuration: plan.contractDuration,
      isTrial: plan.isTrial
    });
  };

  const cancelEdit = () => {
    setEditingPlan(null);
    setEditData({});
  };

  const saveEdit = async (planId: string) => {
    try {
      await planService.updateUserPlan(planId, editData);
      setEditingPlan(null);
      setEditData({});
      await loadPlans();
      
      toast({
        title: "Plano atualizado",
        description: "As alterações foram salvas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano",
        variant: "destructive"
      });
    }
  };

  const generateNewLicenseKey = (orgPrefix: string = 'PINEE') => {
    const newKey = planService.generateLicenseKey(orgPrefix);
    setEditData(prev => ({ ...prev, licenseKey: newKey }));
  };

  const getPlanBadgeColor = (accountType: AccountType) => {
    switch (accountType) {
      case 'free': return 'secondary';
      case 'premium': return 'default';
      case 'lifetime': return 'secondary';
      case 'enterprise': return 'default';
    }
  };

  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'pending': return 'outline';
      case 'canceled': return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo - Planos</h1>
        <p className="text-muted-foreground mt-1">Gerencie todos os planos de usuários</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar (User ID ou License Key)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <Select value={accountTypeFilter} onValueChange={(value) => setAccountTypeFilter(value as AccountType | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="lifetime">Vitalício</SelectItem>
                  <SelectItem value="enterprise">Licença Exclusiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={loadPlans} disabled={loading} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Planos */}
      <Card>
        <CardHeader>
          <CardTitle>Planos de Usuários ({filteredPlans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiração</TableHead>
                  <TableHead>License Key</TableHead>
                  <TableHead>Máx. Usuários</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-mono text-sm">
                      {plan.userId.substring(0, 8)}...
                    </TableCell>
                    
                    <TableCell>
                      {editingPlan === plan.id ? (
                        <Select 
                          value={editData.accountType} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, accountType: value as AccountType }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Gratuito</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="lifetime">Vitalício</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={getPlanBadgeColor(plan.accountType)}>
                          {plan.accountType}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {editingPlan === plan.id ? (
                        <Select 
                          value={editData.paymentStatus} 
                          onValueChange={(value) => setEditData(prev => ({ ...prev, paymentStatus: value as PaymentStatus }))}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={getStatusBadgeVariant(plan.paymentStatus)}>
                          {plan.paymentStatus}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {editingPlan === plan.id ? (
                        <Input
                          type="datetime-local"
                          value={editData.expirationDate ? new Date(editData.expirationDate).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            expirationDate: e.target.value ? new Date(e.target.value).toISOString() : undefined 
                          }))}
                          className="w-40"
                        />
                      ) : (
                        plan.expirationDate ? (
                          <span className="text-sm">
                            {new Date(plan.expirationDate).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      )}
                    </TableCell>

                    <TableCell>
                      {editingPlan === plan.id && editData.accountType === 'enterprise' ? (
                        <div className="flex gap-1">
                          <Input
                            value={editData.licenseKey || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, licenseKey: e.target.value }))}
                            className="w-32 font-mono text-xs"
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateNewLicenseKey()}
                          >
                            <Key className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        plan.licenseKey ? (
                          <span className="font-mono text-xs">{plan.licenseKey}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      )}
                    </TableCell>

                    <TableCell>
                      {editingPlan === plan.id ? (
                        <Input
                          type="number"
                          value={editData.maxUsers || ''}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            maxUsers: e.target.value ? parseInt(e.target.value) : undefined 
                          }))}
                          className="w-20"
                          placeholder="∞"
                        />
                      ) : (
                        plan.maxUsers || <span className="text-muted-foreground">∞</span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editingPlan === plan.id ? (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => saveEdit(plan.id)}>
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(plan)}>
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPlans.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum plano encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlanPanel;
