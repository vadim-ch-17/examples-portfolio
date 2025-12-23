import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notificationService } from "@/services";
import { useAppSelector } from "@/store/hooks";
import { getUser } from "@/store/selectors";
import type { NotificationResponse } from "@/types";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const user = useAppSelector(getUser);

  const {
    data,
    error,
    isLoading,
    refetch: fetchNotifications,
  } = useQuery<NotificationResponse>({
    queryKey: ["notifications", user?.id],
    queryFn: () => notificationService.getNotifications(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 300000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;

  const markAsRead = useMutation({
    mutationFn: (notificationId: number) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (notificationId: number) =>
      notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const clearAllNotifications = useMutation({
    mutationFn: () => notificationService.clearAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications,
    unreadCount,
    loading: isLoading,
    error,
    fetchNotifications,
    markAsRead: markAsRead.mutateAsync,
    deleteNotification: deleteNotification.mutateAsync,
    markAllAsRead: markAllAsRead.mutateAsync,
    clearAllNotifications: clearAllNotifications.mutateAsync,
  };
};
