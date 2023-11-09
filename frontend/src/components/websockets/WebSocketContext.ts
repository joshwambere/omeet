import React, {createContext, FC, ReactElement, useContext, useEffect, useState} from 'react';

// Create a WebSocket context
const WebSocketContext = createContext<WebSocket | null>(null);

export const useWebSocket = () => useContext(WebSocketContext);

// Create a WebSocket provider

type WebSocketProviderType = {
    children: React.FC;
};
export const WebSocketProvider: FC<WebSocketProviderType> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/ws');

        ws.onopen = () => {
        console.log('connected');
        };

        ws.onclose = () => {
        console.log('disconnected');
        };

        setSocket(ws);

        return () => {
        ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
        {children}
        </WebSocketContext.Provider>
    );
}
