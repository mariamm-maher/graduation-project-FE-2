import { io } from 'socket.io-client';
import api from '../config/axios';

let socketInstance = null;

const getAccessToken = () => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
};

const getSocketBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const axiosBase = api?.defaults?.baseURL || 'http://localhost:5000/api';
  return axiosBase.replace(/\/api\/?$/, '');
};

export const connectChatSocket = () => {
  if (socketInstance?.connected) return socketInstance;

  const token = getAccessToken();
  const baseUrl = getSocketBaseUrl();

  socketInstance = io(baseUrl, {
    transports: ['websocket'],
    withCredentials: true,
    auth: {
      token
    }
  });

  return socketInstance;
};

export const getChatSocket = () => socketInstance;

export const disconnectChatSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
