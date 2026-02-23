import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';
import { 
  User, 
  Star, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Settings, 
  BarChart3,
  Camera,
  Package,
  Shield
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RecentTask {
  name: string;
  completed: boolean;
  amount: number;
  timeAgo: string;
}

export default function MyProfile() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading || !isFetched) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile || !userProfile.humanWorker) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Alert className="max-w-md">
          <AlertTitle className="text-lg font-semibold">{t('profile.noProfile')}</AlertTitle>
          <AlertDescription>
            {t('profile.noProfileDesc')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const worker = userProfile.humanWorker;
  
  // Calculate rating based on completed tasks (mock for now)
  const completedTasks = 0; // This would come from backend
  const rating = completedTasks > 0 ? 4.8 : 0;
  
  // Calculate earnings (mock data - would come from backend)
  const totalEarnings = 0;
  const todayEarnings = 0;
  const pendingTasks = 0;

  // Mock recent tasks - empty for now, would come from backend
  const recentTasks: RecentTask[] = [
    // { name: 'Foto loja X', completed: true, amount: 15, timeAgo: '2h atrás' },
    // { name: 'Entrega Y', completed: true, amount: 20, timeAgo: '1 dia' },
  ];

  const getSkillIcon = (skill: any) => {
    if (skill.__kind__ === 'photography') return <Camera className="h-4 w-4" />;
    if (skill.__kind__ === 'delivery') return <Package className="h-4 w-4" />;
    if (skill.__kind__ === 'verification') return <Shield className="h-4 w-4" />;
    return null;
  };

  const getSkillLabel = (skill: any) => {
    if (skill.__kind__ === 'photography') return 'Fotografia';
    if (skill.__kind__ === 'delivery') return 'Entrega';
    if (skill.__kind__ === 'verification') return 'Verificação';
    if (skill.__kind__ === 'custom') return skill.custom;
    return 'Outro';
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.myProfile')}</h1>
        </div>

        {/* Main Profile Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {worker.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                      <span>({completedTasks} tasks)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Évora 5km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skills */}
            <div>
              <h3 className="text-sm font-semibold mb-2 uppercase text-muted-foreground">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {getSkillIcon(skill)}
                    {getSkillLabel(skill)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Preço/hora</p>
                  <p className="text-xl font-bold">€{worker.price.toFixed(2)}/h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Preço/task</p>
                  <p className="text-xl font-bold">€{worker.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Earnings */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">Ganhos</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total (93% após taxa 7%)</p>
                  <p className="text-2xl font-bold text-primary">€{totalEarnings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold">€{todayEarnings.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Tasks Summary */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">Tasks</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Completas</p>
                    <p className="text-xl font-bold">{completedTasks}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-xl font-bold">{pendingTasks}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimas Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{task.name}</p>
                        <p className="text-sm text-muted-foreground">{task.timeAgo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">€{task.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma task completada ainda</p>
                <p className="text-sm mt-1">Aceite tasks no dashboard para começar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate({ to: '/settings' })}
            className="flex-1"
            variant="outline"
          >
            <Settings className="mr-2 h-4 w-4" />
            {t('profile.editProfile')}
          </Button>
          <Button 
            onClick={() => navigate({ to: '/analytics' })}
            className="flex-1"
            variant="outline"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('profile.statsAnalytics')}
          </Button>
        </div>
      </div>
    </div>
  );
}
