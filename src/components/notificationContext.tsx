import { useState, type ReactNode } from 'react';
import { NotificationContext } from '../AppUses/useNotification';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
  });

  const handleNotification = (message: string, type: 'success' | 'error' = "success") => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification({ message: "", type: "success" });
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ handleNotification }}>
      {children}
      {notification.message && (
        <div
          className={`fixed top-20 right-20 px-6 py-4 rounded-xl text-white text-lg font-bold z-50 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  );
};
