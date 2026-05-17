import { io } from 'socket.io-client';
import api from '../config/axios';
import useAuthStore from '../stores/authStore';

let socketInstance = null;
let connectPromise = null;

const getSocketBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit.replace(/\/api\/?$/, '').replace(/\/$/, '');

  const axiosBase = api?.defaults?.baseURL || 'http://localhost:5000/api';
  return axiosBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

const isTokenExpiredConnectError = (error) => {
  const raw = error?.message || error?.data?.message || error?.description || '';
  const message = String(raw).toLowerCase();
  return (
    message.includes('tokenexpirederror') ||
    message.includes('jwt expired') ||
    message.includes('token expired') ||
    message.includes('access token has expired')
  );
};

const waitForConnection = (socket) => {
  if (socket.connected) return Promise.resolve(socket);

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
    };

    const onConnect = () => {
      cleanup();
      resolve(socket);
    };

    const onError = (error) => {
      if (isTokenExpiredConnectError(error)) return;
      cleanup();
      reject(error);
    };

    socket.once('connect', onConnect);
    socket.on('connect_error', onError);
    socket.connect();
  });
};

const bindAuthRecovery = (socket) => {
  if (!socket || socket.__notificationAuthRecoveryBound) return;
  socket.__notificationAuthRecoveryBound = true;

  socket.on('connect_error', async (error) => {
    if (!isTokenExpiredConnectError(error)) return;

    try {
      const token = await useAuthStore.getState().getValidAccessToken(true);
      if (!token) return;
      socket.auth = { ...(socket.auth || {}), token };
      if (!socket.connected) socket.connect();
    } catch (err) {
      console.error('Notification socket re-authentication failed:', err);
      disconnectNotificationSocket();
    }
  });
};

export const connectNotificationSocket = async () => {
  if (socketInstance?.connected) return socketInstance;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    const token = await useAuthStore.getState().getValidAccessToken();
    if (!token) throw new Error('No valid access token available for notification socket');

    if (!socketInstance) {
      socketInstance = io(getSocketBaseUrl(), {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        auth: { token }
      });
      bindAuthRecovery(socketInstance);
    } else {
      socketInstance.auth = { ...(socketInstance.auth || {}), token };
    }

    return waitForConnection(socketInstance);
  })();

  try {
    return await connectPromise;
  } finally {
    connectPromise = null;
  }
};

export const getNotificationSocket = () => socketInstance;

export const disconnectNotificationSocket = () => {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = null;
  }
  connectPromise = null;
};
