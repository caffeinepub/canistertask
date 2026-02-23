import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useBrowserNotifications } from '../hooks/useBrowserNotifications';
import { Bell, BellOff, AlertCircle } from 'lucide-react';

export default function Settings() {
  const { t } = useTranslation();
  const { permission, requestPermission, isSupported } = useBrowserNotifications();

  const handleEnableNotifications = async () => {
    await requestPermission();
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t('notifications.settings')}</CardTitle>
            <CardDescription>{t('notifications.settingsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isSupported ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('notifications.notSupported')}</AlertTitle>
                <AlertDescription>
                  {t('notifications.notSupportedDesc')}
                </AlertDescription>
              </Alert>
            ) : permission === 'denied' ? (
              <Alert variant="destructive">
                <BellOff className="h-4 w-4" />
                <AlertTitle>{t('notifications.permissionDenied')}</AlertTitle>
                <AlertDescription>
                  {t('notifications.permissionDeniedDesc')}
                </AlertDescription>
              </Alert>
            ) : permission === 'granted' ? (
              <Alert>
                <Bell className="h-4 w-4" />
                <AlertTitle>{t('notifications.enabled')}</AlertTitle>
                <AlertDescription>
                  {t('notifications.enabledDesc')}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('notifications.enableDesc')}
                </p>
                <Button onClick={handleEnableNotifications}>
                  <Bell className="mr-2 h-4 w-4" />
                  {t('notifications.enableButton')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.preferences')}</CardTitle>
            <CardDescription>{t('settings.preferencesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh" className="flex flex-col gap-1">
                <span>{t('settings.autoRefresh')}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {t('settings.autoRefreshDesc')}
                </span>
              </Label>
              <Switch id="auto-refresh" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
