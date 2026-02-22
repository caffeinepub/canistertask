import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{t('analytics.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas
          </CardTitle>
          <CardDescription>As suas análises aparecerão aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            O dashboard de análises será implementado em breve com gráficos de ganhos e mapas de calor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
