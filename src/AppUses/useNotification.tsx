import { createContext, useContext } from 'react';

export interface NotificationContextType {
  handleNotification: (message: string, type?: 'success' | 'error') => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
