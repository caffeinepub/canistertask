import { useGetDashboardStats, useIsCallerAdmin, useGetDailyEarningsStats, useGetDailySummary, useGetLast7DaysStats, useGetTodayAdminStats } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, CheckCircle, Users, DollarSign, Calendar, Activity, Clock, Heart } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from '../hooks/useTranslation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: stats, isLoading: statsLoading, error } = useGetDashboardStats();
  const { data: dailySummary, isLoading: dailySummaryLoading } = useGetDailySummary();
  const { data: last7DaysStats, isLoading: last7DaysLoading } = useGetLast7DaysStats();
  const { data: todayAdminStats, isLoading: todayAdminStatsLoading } = useGetTodayAdminStats();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fromTimestamp = BigInt(Math.floor(new Date(fromDate).getTime() / 86400000));
  const toTimestamp = BigInt(Math.floor(new Date(toDate).getTime() / 86400000));

  const { data: dailyStats, isLoading: dailyStatsLoading } = useGetDailyEarningsStats(
    fromTimestamp,
    toTimestamp
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    queryClient.invalidateQueries({ queryKey: ['dailyEarningsStats'] });
    queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
    queryClient.invalidateQueries({ queryKey: ['last7DaysStats'] });
    queryClient.invalidateQueries({ queryKey: ['todayAdminStats'] });
  };

  const formatDate = (dayTimestamp: bigint) => {
    const date = new Date(Number(dayTimestamp) * 86400000);
    return date.toLocaleDateString();
  };

  const formatChartDate = (dayTimestamp: bigint) => {
    const date = new Date(Number(dayTimestamp) * 86400000);
    return date.toLocaleDateString('pt-PT', { month: 'short', day: 'numeric' });
  };

  // Prepare chart data from last 7 days stats
  const chartData = last7DaysStats
    ? [...last7DaysStats]
        .reverse()
        .map((stat) => ({
          date: formatChartDate(stat.day),
          earnings: stat.completedAmount * 0.07, // 7% platform fee
          tasks: Number(stat.completedTasks),
        }))
    : [];

  if (isAdminLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle className="text-lg font-semibold">{t('admin.accessDenied')}</AlertTitle>
          <AlertDescription>
            {t('admin.accessDeniedDesc')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const inProgressTasks = stats ? Number(stats.totalTasks) - Number(stats.completedTasks) : 0;

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground">{t('admin.dashboardDesc')}</p>
        </div>
        <Button onClick={handleRefresh} disabled={statsLoading} variant="outline" size="sm">
          <RefreshCw className={`mr-2 h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
          {t('admin.refresh')}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>{t('admin.errorLoading')}</AlertTitle>
          <AlertDescription>
            {t('admin.errorLoadingDesc')}
          </AlertDescription>
        </Alert>
      )}

      {/* HCoragem Today Stats - Prominent Display */}
      <Card className="mb-6 border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <CardTitle className="text-2xl font-bold">HCoragem</CardTitle>
            </div>
            <Badge variant="default" className="bg-primary">
              {t('admin.feeActive')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {todayAdminStatsLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <div className="text-3xl font-bold text-primary">
              €{todayAdminStats?.totalEarnings.toFixed(2) || '0.00'} hoje | {todayAdminStats?.acceptedTasks.toString() || '0'} tasks
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Ganhos e tasks aceites hoje (7% de cada task)
          </p>
        </CardContent>
      </Card>

      {/* Real-time Statistics - Today's Summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Hoje</CardTitle>
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            {dailySummaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{dailySummary?.taskCount.toString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tarefas criadas hoje
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completas Hoje</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            {dailySummaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{dailySummary?.completedTasks.toString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tarefas completadas hoje
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workers Ativos Évora</CardTitle>
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.activeWorkers.toString() || '0'}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Workers registados
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 7-Day Earnings Chart */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Ganhos HCoragem - Últimos 7 Dias</CardTitle>
          </div>
          <CardDescription>Evolução dos ganhos da plataforma (7% de cada tarefa)</CardDescription>
        </CardHeader>
        <CardContent>
          {last7DaysLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'earnings') return [`€${value.toFixed(2)}`, 'Ganhos'];
                    if (name === 'tasks') return [value, 'Tasks'];
                    return [value, name];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Sem dados disponíveis
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.hcoragemEarnings')}</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold">
                  €{stats?.totalPlatformFees.toFixed(2) || '0.00'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin.totalFees')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalTasks')}</CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.totalTasks.toString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin.tasksCreated')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.completedTasks')}</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{stats?.completedTasks.toString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin.tasksCompleted')}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.inProgressTasks')}</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold">{inProgressTasks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('admin.activeTasks')}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.totalRevenue')}</CardTitle>
            <CardDescription>{t('admin.totalRevenueDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <div className="text-4xl font-bold text-primary">
                €{stats?.totalRevenue.toFixed(2) || '0.00'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.activeWorkers')}</CardTitle>
            <CardDescription>{t('admin.activeWorkersDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-12 w-24" />
            ) : (
              <div className="text-4xl font-bold text-primary">
                {stats?.activeWorkers.toString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>{t('admin.dailyEarnings')}</CardTitle>
          </div>
          <CardDescription>{t('admin.dailyEarningsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from-date">{t('admin.fromDate')}</Label>
              <Input
                id="from-date"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">{t('admin.toDate')}</Label>
              <Input
                id="to-date"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {dailyStatsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : dailyStats && dailyStats.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.date')}</TableHead>
                    <TableHead className="text-right">{t('admin.platformFees')}</TableHead>
                    <TableHead className="text-right">{t('admin.tasksCompleted')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyStats.map((stat) => (
                    <TableRow key={stat.date.toString()}>
                      <TableCell className="font-medium">{formatDate(stat.date)}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        €{stat.totalFees.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">{stat.taskCount.toString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.noDataForRange')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
