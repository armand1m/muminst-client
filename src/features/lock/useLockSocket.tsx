import useWebSocket, { ReadyState } from 'react-use-websocket';

interface LockState {
  isLocked: boolean;
}

const defaultState: LockState = {
  isLocked: false,
};

export const useLockSocket = (): LockState => {
  const socketUrl = 'ws://localhost:4000/ws';
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('WebSocket connection established.'),
    /** Will attempt to reconnect on all close events, such as server shutting down */
    shouldReconnect: (_closeEvent) => true,
  });

  if (readyState !== ReadyState.OPEN || !lastMessage) {
    return defaultState;
  }

  return JSON.parse(lastMessage.data) as LockState;
};
