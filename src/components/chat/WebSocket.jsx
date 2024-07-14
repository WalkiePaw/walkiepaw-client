import { useEffect, useRef, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import * as stompClient from "react-redux";

const WebSocket = (url) => {
  const client = useRef(null);

  useEffect(() => {
    const socket = new SockJS(url);
    client.current = Stomp.over(socket);

    const token = localStorage.getItem('token'); // 또는 다른 방식으로 토큰 획득
    console.log('token: ' + token);
    const headers = {
      'Authorization': 'Bearer ' + token
    };

    client.current.connect(headers, function(frame) {
      console.log('Connected: ' + frame);
    }, function(error) {
      console.log('Error: ' + error);
    });

    return () => {
      if (client.current) {
        client.current.disconnect();
      }
    };
  }, [url]);

  const subscribe = useCallback((topic, callback) => {
    if (client.current && client.current.connected) {
      return client.current.subscribe(topic, message => {
        callback(JSON.parse(message.body));
      });
    }
  }, []);

  const send = useCallback((destination, body) => {
    if (client.current && client.current.connected) {
      const headers = {
        "content-type": "application/json",  // 예시로 콘텐츠 타입 추가
        // 여기에 다른 필요한 헤더를 추가
      };
      try {
        client.current.send(destination, headers, JSON.stringify(body));
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }, [client.current]);


  return { subscribe, send };
};

export default WebSocket;