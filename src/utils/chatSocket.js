import { io } from 'socket.io-client';
import api from '../config/axios';
import useAuthStore from '../stores/authStore';

let socketInstance = null;
let socketConsumers = 0;
let socketConnectPromise = null;
let socketReauthInProgress = false;

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

const bindAuthRecoveryListener = (socket) => {
  if (!socket || socket.__authRecoveryBound) return;
  socket.__authRecoveryBound = true;

  socket.on('connect_error', async (error) => {
    if (!isTokenExpiredConnectError(error) || socketReauthInProgress) {
      return;
    }

    socketReauthInProgress = true;
    try {
      const newToken = await useAuthStore.getState().getValidAccessToken(true);
      if (!newToken) {
        throw new Error('Unable to refresh access token for socket reconnection');
      }

      socket.auth = { ...(socket.auth || {}), token: newToken };
      if (!socket.connected) {
        socket.connect();
      }
    } catch (reauthError) {
      console.error('Socket re-authentication failed:', reauthError);
      disconnectChatSocket();
    } finally {
      socketReauthInProgress = false;
    }
  });
};

const getSocketBaseUrl = () => {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const axiosBase = api?.defaults?.baseURL || 'http://localhost:5000/api';
  return axiosBase.replace(/\/api\/?$/, '');
};

export const connectChatSocket = async () => {
  if (socketInstance?.connected) return socketInstance;
  if (socketConnectPromise) return socketConnectPromise;

  socketConnectPromise = (async () => {
    const token = await useAuthStore.getState().getValidAccessToken();
    if (!token) {
      throw new Error('No valid access token available for socket connection');
    }

    const baseUrl = getSocketBaseUrl();

    if (!socketInstance) {
      socketInstance = io(baseUrl, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: false,
        auth: {
          token
        }
      });
      bindAuthRecoveryListener(socketInstance);
    } else {
      socketInstance.auth = { ...(socketInstance.auth || {}), token };
    }

    if (!socketInstance.connected) {
      socketInstance.connect();
    }

    return socketInstance;
  })();

  try {
    return await socketConnectPromise;
  } finally {
    socketConnectPromise = null;
  }
};

export const acquireChatSocket = async () => {
  socketConsumers += 1;
  try {
    return await connectChatSocket();
  } catch (error) {
    socketConsumers = Math.max(0, socketConsumers - 1);
    throw error;
  }
};

export const getChatSocket = () => socketInstance;

export const releaseChatSocket = () => {
  socketConsumers = Math.max(0, socketConsumers - 1);
  if (socketConsumers === 0) {
    disconnectChatSocket();
  }
};

export const disconnectChatSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
  socketConnectPromise = null;
  socketReauthInProgress = false;
  socketConsumers = 0;
};
