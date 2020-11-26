import useWebSocket, { ReadyState } from 'react-use-websocket';

interface LockState {
  isLocked: boolean;
}

const socketUrl =
  String(process.env.REACT_APP_API_URL).replace('http', 'ws') +
  'ws';

export const useLockSocket = (): LockState => {
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
