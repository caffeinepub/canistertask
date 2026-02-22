import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Loader2, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkerDashboard() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('dashboard.welcome')}, {userProfile?.humanWorker?.name || userProfile?.aiAgent?.agentName || 'User'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t('dashboard.noTasks')}
            </CardTitle>
            <CardDescription>Tarefas disponíveis aparecerão aqui</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O sistema de tarefas será implementado em breve. Por enquanto, o seu perfil está configurado e pronto.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
