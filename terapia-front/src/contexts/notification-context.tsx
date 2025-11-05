'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationProps } from '@/components/ui/notification';

interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, 'id'>) => string;
  removeNotification: (id: string) => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showSuccess = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const showError = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const showWarning = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration });
  };

  const showInfo = (title: string, message?: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  const value: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
