import { useEffect, useRef } from 'react';

interface UseWebSocketProps {
  uri: string;
  title?: string;
  onMessage: (event: MessageEvent) => void;
  onOpen?: () => void;
  onError?: (error: any) => void;
  onClose?: (event: any) => void;
}

const useWebSocket = ({ uri, title, onMessage, onOpen, onError, onClose }: UseWebSocketProps) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!uri) {
      return;
    }

    const socket = new WebSocket(uri);
    socketRef.current = socket;

    socket.onopen = () => {
      onOpen?.();
    };

    socket.onmessage = onMessage as any;

    socket.onerror = (error) => {
      console.error(`WebSocket error ${title}:`, error);
      onError?.(error);
    };

    socket.onclose = (e) => {
      console.log(`WebSocket closed ${title}:`, e.code, e.reason);
      onClose?.(e);
    };

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri]);

  return socketRef;
};

export default useWebSocket;
