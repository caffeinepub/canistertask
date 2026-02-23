import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function useBrowserNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const navigate = useNavigate();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  };

  const showBrowserNotification = (title: string, body: string, taskId?: bigint) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/assets/generated/canistertask-icon.dim_512x512.png',
        badge: '/assets/generated/canistertask-icon.dim_512x512.png',
        tag: taskId ? `task-${taskId}` : undefined,
      });

      notification.onclick = () => {
        window.focus();
        if (taskId) {
          navigate({ to: '/dashboard' });
        }
        notification.close();
      };

      return notification;
    }
    return null;
  };

  return {
    permission,
    requestPermission,
    showBrowserNotification,
    isSupported: 'Notification' in window,
  };
}
