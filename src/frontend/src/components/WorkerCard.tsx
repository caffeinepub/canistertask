import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Star, Euro, CheckCircle2, Clock } from 'lucide-react';
import { HumanWorkerProfile } from '../backend';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from '../hooks/useTranslation';

interface WorkerCardProps {
  worker: HumanWorkerProfile;
  completedTasks?: number;
  totalEarnings?: number;
  lastTask?: {
    title: string;
    completedAt: string;
  };
}

export default function WorkerCard({ worker, completedTasks = 0, totalEarnings = 0, lastTask }: WorkerCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSkills = (skills: typeof worker.skills) => {
    return skills
      .map(skill => {
        if (typeof skill === 'object' && 'custom' in skill) {
          return skill.custom;
        }
        if (typeof skill === 'object') {
          const key = Object.keys(skill)[0];
          return key.charAt(0).toUpperCase() + key.slice(1);
        }
        return String(skill);
      })
      .join(', ');
  };

  const handleViewProfile = () => {
    navigate({ to: `/perfil/${worker.principal.toString()}` });
  };

  const getPhotoUrl = (photo: Uint8Array) => {
    // Convert Uint8Array to regular array for Blob constructor
    const photoArray = Array.from(photo);
    const blob = new Blob([new Uint8Array(photoArray)], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            {worker.photo && (
              <AvatarImage src={getPhotoUrl(worker.photo)} alt={worker.name} />
            )}
            <AvatarFallback>{getInitials(worker.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              {worker.name}
              {worker.available && (
                <Badge variant="outline" className="text-xs">
                  {t('workers.available')}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({completedTasks} {completedTasks === 1 ? 'task' : 'tasks'})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            Évora {worker.location.radius}km
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Euro className="h-4 w-4 text-primary" />
          <span className="font-semibold">€{worker.price.toFixed(2)}/h</span>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">{t('workers.skills')}:</p>
          <p className="font-medium">{formatSkills(worker.skills)}</p>
        </div>

        {totalEarnings > 0 && (
          <div className="text-sm">
            <p className="text-muted-foreground">{t('workers.earnings')}:</p>
            <p className="font-semibold text-primary">€{totalEarnings.toFixed(2)}</p>
          </div>
        )}

        {lastTask && (
          <div className="flex items-start gap-2 text-sm p-2 bg-muted/50 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{lastTask.title}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{lastTask.completedAt}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="default" size="sm" className="flex-1">
            {t('workers.hire')}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={handleViewProfile}>
            {t('workers.viewTasks')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
