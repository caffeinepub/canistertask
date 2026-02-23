import { useGetCallerUserProfile, useGetUnreadNotifications } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import DeploymentStatus from '../components/DeploymentStatus';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import { useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bell } from 'lucide-react';

export default function WorkerDashboard() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { data: unreadNotifications } = useGetUnreadNotifications();
  const { t } = useTranslation();
  const { showBrowserNotification, permission } = useBrowserNotifications();
  const previousNotificationCount = useRef(0);

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

  const testTasks = [
    {
      id: 1,
      title: 'Fotografar Praça do Giraldo',
      description: 'Tirar 10 fotos da praça em diferentes ângulos',
      status: 'open',
      price: 15.0,
      location: 'Évora, Portugal',
    },
    {
      id: 2,
      title: 'Verificar endereço comercial',
      description: 'Confirmar existência de loja na Rua 5 de Outubro',
      status: 'in-progress',
      price: 8.5,
      location: 'Lisboa, Portugal',
    },
    {
      id: 3,
      title: 'Entrega rápida documento',
      description: 'Levar envelope do centro à universidade',
      status: 'completed',
      price: 12.0,
      location: 'Évora, Portugal',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">{t('task.status.open')}</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">{t('task.status.inProgress')}</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-600 text-green-600">
          {t('task.status.completed')}
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
        <Alert className="mb-6 border-primary">
          <Bell className="h-4 w-4" />
          <AlertTitle>{t('notifications.newTasksAvailable')}</AlertTitle>
          <AlertDescription>
            {t('notifications.youHave')} {unreadNotifications.length} {t('notifications.newTasks')}
          </AlertDescription>
        </Alert>
      )}

      <DeploymentStatus />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.availableTasks')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  {getStatusBadge(task.status)}
                </div>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{task.price.toFixed(2)} HC</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{task.location}</span>
                </div>
                {task.status === 'completed' && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{t('task.completed')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
