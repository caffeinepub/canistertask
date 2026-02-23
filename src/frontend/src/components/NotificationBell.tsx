import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetUnreadNotificationsCount, useGetUnreadNotifications, useMarkNotificationAsRead } from '../hooks/useQueries';
import { useTranslation } from '../hooks/useTranslation';
import { Link } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationBell() {
  const { data: count, isLoading: countLoading } = useGetUnreadNotificationsCount();
  const { data: notifications, isLoading: notificationsLoading } = useGetUnreadNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const { t } = useTranslation();

  const unreadCount = count ? Number(count) : 0;

  const handleMarkAsRead = (notificationId: bigint) => {
    markAsRead.mutate(notificationId);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return `${diffMins}${t('notifications.minsAgo')}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}${t('notifications.hoursAgo')}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}${t('notifications.daysAgo')}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">{t('notifications.title')}</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount}</Badge>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notificationsLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id.toString()}
                  className="flex flex-col gap-2 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t('notifications.newTask')}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.taskDetails}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={markAsRead.isPending}
                  >
                    {t('notifications.markAsRead')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">{t('notifications.noUnread')}</p>
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Link to="/notifications">
            <Button variant="ghost" className="w-full" size="sm">
              {t('notifications.viewAll')}
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
