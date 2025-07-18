import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io } from 'socket.io-client';
import { useWallet } from './WalletContext';

interface Notification {
  id: string;
  type: 'transaction' | 'mint' | 'transfer' | 'connection' | 'governance';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  txHash?: string;
  blockNumber?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { account, isConnected } = useWallet();

  useEffect(() => {
    if (isConnected && account) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const newSocket = io(backendUrl, {
        query: { address: account }
      });

      newSocket.on('transaction_confirmed', (data) => {
        addNotification({
          type: 'transaction',
          title: 'Transaction Confirmed',
          message: `Your transaction has been confirmed in block ${data.blockNumber}`,
          txHash: data.txHash,
          blockNumber: data.blockNumber
        });
      });
      newSocket.on('mint_successful', (data) => {
        addNotification({
          type: 'mint',
          title: 'Mint Successful',
          message: `Successfully minted ${data.amount} tokens`,
          txHash: data.txHash
        });
      });
      newSocket.on('transfer_received', (data) => {
        addNotification({
          type: 'transfer',
          title: 'Tokens Received',
          message: `Received ${data.amount} tokens from ${data.from.slice(0, 10)}...`,
          txHash: data.txHash
        });
      });
      newSocket.on('governance_proposal', (data) => {
        addNotification({
          type: 'governance',
          title: 'New Proposal',
          message: `New governance proposal: ${data.title}`,
        });
      });
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isConnected, account]);

  // Request notification permission only inside a user event
  const requestNotificationPermission = () => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};