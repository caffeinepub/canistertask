import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TaskHeatmap from '../components/TaskHeatmap';

export default function Analytics() {
  const { t } = useTranslation();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.heatmapDesc')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.taskHeatmap')}</CardTitle>
          <CardDescription>{t('analytics.taskDensity')}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <TaskHeatmap />
        </CardContent>
      </Card>
    </div>
  );
}
