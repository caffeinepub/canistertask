import { useGetAllNotifications, useMarkNotificationAsRead } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Notifications() {
  const { data: notifications, isLoading } = useGetAllNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const { t } = useTranslation();

  const handleMarkAsRead = (notificationId: bigint) => {
    markAsRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (notifications) {
      notifications
        .filter(n => !n.isRead)
        .forEach(n => markAsRead.mutate(n.id));
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('notifications.title')}</h1>
          <p className="text-muted-foreground">{t('notifications.description')}</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} disabled={markAsRead.isPending}>
            <Check className="mr-2 h-4 w-4" />
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id.toString()} className={notification.isRead ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{t('notifications.newTask')}</CardTitle>
                      {!notification.isRead && (
                        <Badge variant="default">{t('notifications.unread')}</Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </CardDescription>
                  </div>
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsRead.isPending}
                    >
                      {t('notifications.markAsRead')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{notification.taskDetails}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium">{t('notifications.noNotifications')}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('notifications.noNotificationsDesc')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
