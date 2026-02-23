import { useGetCallerUserProfile, useGetUnreadNotifications } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, TestTube, AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DeploymentStatus from '../components/DeploymentStatus';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import { useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { TEST_MODE_ENABLED } from '../config/features';
import { useTestMode } from '../hooks/useTestMode';
import TestModeStats from '../components/TestModeStats';
import { useLoadingTimeout } from '../hooks/useLoadingTimeout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useQueryClient } from '@tanstack/react-query';

interface Task {
  id: bigint;
  title: string;
  description: string;
  price: number;
  location: string;
}

const REAL_TASKS: Task[] = [
  {
    id: 1n,
    title: 'Fotografar loja Évora',
    description: 'Tirar fotos da loja no centro histórico de Évora',
    price: 15,
    location: 'Évora, Portugal',
  },
  {
    id: 2n,
    title: 'Verificar morada',
    description: 'Confirmar existência de estabelecimento comercial',
    price: 10,
    location: 'Évora, Portugal',
  },
  {
    id: 3n,
    title: 'Entrega local',
    description: 'Entrega de documento no centro da cidade',
    price: 20,
    location: 'Évora, Portugal',
  },
];

function WorkerDashboardContent() {
  const { data: profile, isLoading, error, refetch } = useGetCallerUserProfile();
  const { data: unreadNotifications } = useGetUnreadNotifications();
  const { t } = useTranslation();
  const { showBrowserNotification, permission } = useBrowserNotifications();
  const previousNotificationCount = useRef(0);
  const { simulateTaskCompletion } = useTestMode();
  const queryClient = useQueryClient();
  
  const { hasTimedOut, reset: resetTimeout } = useLoadingTimeout({
    timeout: 5000,
    isLoading,
  });

  // Show browser notification when new notifications arrive
  useEffect(() => {
    if (unreadNotifications && permission === 'granted') {
      const currentCount = unreadNotifications.length;
      
      if (currentCount > previousNotificationCount.current && previousNotificationCount.current > 0) {
        const newNotifications = unreadNotifications.slice(0, currentCount - previousNotificationCount.current);
        
        newNotifications.forEach(notification => {
          showBrowserNotification(
            t('notifications.newTask'),
            notification.taskDetails,
            notification.taskId
          );
        });
      }
      
      previousNotificationCount.current = currentCount;
    }
  }, [unreadNotifications, permission, showBrowserNotification, t]);

  const handleTestTask = (task: Task) => {
    const simulation = simulateTaskCompletion(task.price);
    
    toast.success('Task simulada! Fee HCoragem: +€' + simulation.platformFee.toFixed(2), {
      description: `Você ganhou €${simulation.workerEarnings.toFixed(2)} nesta simulação`,
      duration: 4000,
    });
  };

  const handleRetry = async () => {
    resetTimeout();
    queryClient.clear();
    await refetch();
  };

  // Show error state if loading timed out or there's an error
  if (hasTimedOut || error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar dashboard</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {error 
                ? 'Não foi possível carregar os dados do dashboard. Verifique sua conexão e tente novamente.'
                : 'O carregamento está a demorar mais do que o esperado. Por favor, tente novamente.'}
            </p>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.welcome')}, {profile?.humanWorker?.name || profile?.aiAgent?.agentName || 'Worker'}!
        </h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      {unreadNotifications && unreadNotifications.length > 0 && (
        <Alert className="mb-6">
          <Bell className="h-4 w-4" />
          <AlertTitle>{t('notifications.unread')}</AlertTitle>
          <AlertDescription>
            {t('notifications.youHave')} {unreadNotifications.length} {t('notifications.newNotifications')}
          </AlertDescription>
        </Alert>
      )}

      {TEST_MODE_ENABLED && (
        <div className="mb-6">
          <TestModeStats />
        </div>
      )}

      <DeploymentStatus />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.availableTasks')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REAL_TASKS.map((task) => (
            <Card key={task.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge variant="default">Disponível</Badge>
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{task.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <DollarSign className="h-4 w-4" />
                  <span>€{task.price.toFixed(2)}</span>
                </div>
                <Button 
                  onClick={() => handleTestTask(task)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  TESTE GRÁTIS
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorkerDashboard() {
  const queryClient = useQueryClient();

  return (
    <ErrorBoundary onReset={() => queryClient.clear()}>
      <WorkerDashboardContent />
    </ErrorBoundary>
  );
}
