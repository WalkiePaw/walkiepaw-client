import { useCallback, useRef, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useWebSocket = (url) => {
  const client = useRef(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    const socket = new SockJS(url);
    client.current = Stomp.over(socket);

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    client.current.connect(headers, () => {
      console.log('Connected to WebSocket');
      setConnected(true);
    }, (error) => {
      console.error('WebSocket connection error:', error);
      setConnected(false);
    });
  }, [url]);

  const disconnect = useCallback(() => {
    if (client.current) {
      client.current.disconnect(() => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      });
    }
  }, []);

  const subscribe = useCallback((destination, callback) => {
    if (client.current && connected) {
      return client.current.subscribe(destination, (message) => {
        const payload = JSON.parse(message.body);
        callback(payload);
      });
    } else {
      console.error('WebSocket is not connected');
      return null;
    }
  }, [connected]);

  const unsubscribe = useCallback((subscription) => {
    if (subscription) {
      subscription.unsubscribe();
    }
  }, []);

  const send = useCallback((destination, body) => {
    if (client.current && connected) {
      client.current.send(destination, {}, JSON.stringify(body));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [connected]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, subscribe, unsubscribe, send };
};

export default useWebSocket;