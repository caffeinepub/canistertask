import { useParams } from '@tanstack/react-router';
import { useGetUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '../hooks/useTranslation';
import { Principal } from '@dfinity/principal';
import { 
  User, 
  Star, 
  MapPin, 
  DollarSign, 
  CheckCircle,
  Camera,
  Package,
  Shield
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function PublicProfile() {
  const { userId } = useParams({ strict: false });
  const { t } = useTranslation();
  
  let principal: Principal | null = null;
  try {
    if (userId) {
      principal = Principal.fromText(userId);
    }
  } catch (error) {
    console.error('Invalid principal:', error);
  }

  const { data: userProfile, isLoading, error } = useGetUserProfile(principal);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !principal) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle className="text-lg font-semibold">{t('profile.error')}</AlertTitle>
          <AlertDescription>
            {t('profile.errorLoadingProfile')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userProfile || !userProfile.humanWorker) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-8">
        <Alert className="max-w-md">
          <AlertTitle className="text-lg font-semibold">{t('profile.notFound')}</AlertTitle>
          <AlertDescription>
            {t('profile.notFoundDesc')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const worker = userProfile.humanWorker;
  
  // Calculate rating based on completed tasks (mock for now)
  const completedTasks = 0;
  const rating = completedTasks > 0 ? 4.8 : 0;

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.workerProfile')}</h1>
          <p className="text-muted-foreground">{t('profile.publicView')}</p>
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
              {worker.available && (
                <Badge variant="default" className="bg-green-600">
                  Disponível
                </Badge>
              )}
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

            {/* Tasks Summary */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-3 uppercase text-muted-foreground">Estatísticas</h3>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasks Completas</p>
                  <p className="text-xl font-bold">{completedTasks}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
