import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, DashboardStats, DailyStats, PushNotification, DailySummary } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.getCallerUserProfile();
      return result;
    },
    enabled: !!actor && !actorFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) throw new Error('Actor or userId not available');
      const result = await actor.getUserProfile(userId);
      return result;
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: 2,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetDashboardStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardStats();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetDailyEarningsStats(from: bigint, to: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyStats[]>({
    queryKey: ['dailyEarningsStats', from.toString(), to.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyEarningsStats(from, to);
    },
    enabled: !!actor && !actorFetching && from > 0n && to > 0n,
    staleTime: 60 * 1000, // 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetDailySummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailySummary>({
    queryKey: ['dailySummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailySummary();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetLast7DaysStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailySummary[]>({
    queryKey: ['last7DaysStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLast7DaysStats();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetTodayAdminStats() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{
    day: bigint;
    totalEarnings: number;
    acceptedTasks: bigint;
  }>({
    queryKey: ['todayAdminStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTodayAdminStats();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute for real-time updates
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAcceptTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['todayAdminStats'] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      queryClient.invalidateQueries({ queryKey: ['last7DaysStats'] });
    },
  });
}

// Notification hooks
export function useGetUnreadNotificationsCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['unreadNotificationsCount'],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getUnreadNotificationsCount();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Poll every 30 seconds
    retry: 2,
  });
}

export function useGetUnreadNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PushNotification[]>({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnreadNotifications();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 30000, // Poll every 30 seconds
    retry: 2,
  });
}

export function useGetAllNotifications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PushNotification[]>({
    queryKey: ['allNotifications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotifications();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
  });
}
