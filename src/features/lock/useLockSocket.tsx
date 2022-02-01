import { ApiMode, getApiUrl } from 'features/api/useMuminstApi';
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface LockState {
  isLocked: boolean;
}

export const useLockSocket = (apiMode: ApiMode): LockState => {
  const apiUrl = getApiUrl(apiMode);
  const socketUrl = String(apiUrl).replace('http', 'ws') + '/ws';

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection established.'),
    /** Will attempt to reconnect on all close events, such as server shutting down */
    shouldReconnect: (_closeEvent) => true,
    onError: console.error,
    onMessage: console.info,
    onClose: console.log,
  });

  if (readyState !== ReadyState.OPEN) {
    return {
      isLocked: true,
    };
  }

  if (!lastMessage) {
    return {
      isLocked: false,
    };
  }

  return JSON.parse(lastMessage.data) as LockState;
};
