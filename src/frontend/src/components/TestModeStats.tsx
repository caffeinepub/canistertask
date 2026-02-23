import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestTube } from 'lucide-react';
import { useTestMode } from '../hooks/useTestMode';

export default function TestModeStats() {
  const { stats } = useTestMode();

  return (
    <Card className="border-dashed border-2 border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5 text-amber-600" />
            Modo de Teste
          </CardTitle>
          <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-400">
            TESTE
          </Badge>
        </div>
        <CardDescription>
          Estatísticas simuladas - não afetam dados reais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {stats.totalTasks === 1 ? '1 task teste' : `${stats.totalTasks} tasks teste`}
            </span>
            <span className="font-semibold">Ganhos: €{stats.totalEarnings.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
