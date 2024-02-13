"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
interface SocketProviderProps {
    children?: React.ReactNode;
    messages?: string[];
}

interface ISocketContext {
    sendMessage: (msg: string) => any;
    messages?: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);
export const useSocket = () => {
    const context = React.useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg) => {
        console.log("sendMessage", msg);
        socket?.emit('event:message', { message: msg });
    }, [socket]);

    const socketContextValue: ISocketContext = {
        sendMessage: sendMessage,
        messages: messages
    };
    // const onMessageReceived = useCallback((msg: string) => {
    //     console.log("Message From Server Received", msg);
    //     const {message} = JSON.parse(msg) as { message: string };
    //     setMessages((messages) => [...messages, message]);


    // },[socket]);
    const onMessageReceived = useCallback((msg: any) => {
        console.log("Message From Server Received", msg);
    
        if (typeof msg === 'string') {
            try {
                const { message } = JSON.parse(msg) as { message: string };
                setMessages((messages) => [...messages, message]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        } else if (typeof msg === 'object' && msg.message) {
            // Handling directly received object
            setMessages((messages) => [...messages, msg.message]);
        } else {
            console.error("Received message format is unexpected:", msg);
        }
    }, [socket]);
    

    useEffect(() => {
        const _socket = io("http://localhost:8000",{
            auth: {
                userId: "123"
            }
        });
        _socket.on("message", onMessageReceived);
        setSocket(_socket);
        return () => {
            _socket.disconnect();
            _socket.off("message", onMessageReceived);
            setSocket(null);
        }

    }, [])

    return (
        <SocketContext.Provider value={socketContextValue}>
            {children}
        </SocketContext.Provider>
    );
};
