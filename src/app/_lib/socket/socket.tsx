"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { WebSocketManager, ConnectionState } from "./WebSocketManager";
import { getWebSocketUrl, getFeatureFlags } from "../../_config/categories";
import { WebSocketErrorBoundary } from "../../_components/errors/ErrorBoundary";

// Get configuration-based WebSocket URL and features
const webSocketUrl = getWebSocketUrl();
const features = getFeatureFlags();

// Create WebSocket Manager instance with configuration
const webSocketManager = new WebSocketManager({
  url: webSocketUrl,
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  autoConnect: false,
});

// Export socket for backward compatibility (initialize first)
webSocketManager.initialize();
export const socket: Socket = webSocketManager.getSocket() as Socket;

// ✅ Enhanced Context Definition with WebSocket Manager
interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionState: ConnectionState;
  webSocketManager: WebSocketManager;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

// ✅ Enhanced Provider using WebSocket Manager
export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );

  useEffect(() => {
    let isMounted = true; // ✅ Prevents state updates on unmounted components

    // Initialize the WebSocket manager
    webSocketManager.initialize();

    // Subscribe to connection state changes
    webSocketManager.onConnectionStateChange((state: ConnectionState) => {
      if (isMounted) {
        setConnectionState(state);
        setIsConnected(state === ConnectionState.CONNECTED);
      }
    });

    // Connect to the WebSocket server
    webSocketManager.connect();

    return () => {
      isMounted = false; // ✅ Prevents unnecessary re-renders
      console.log("🔌 Cleaning up WebSocket connection...");

      // Clean disconnect and destroy
      webSocketManager.disconnect();
    };
  }, []);

  // Enhanced methods using WebSocket Manager
  const joinRoom = (room: string) => {
    webSocketManager.joinRoom(room);
  };

  const leaveRoom = (room: string) => {
    webSocketManager.leaveRoom(room);
  };

  const connect = () => {
    webSocketManager.connect();
  };

  const disconnect = () => {
    webSocketManager.disconnect();
  };

  return (
    <WebSocketErrorBoundary
      onWebSocketError={(error) => {
        console.error("WebSocket Provider Error:", error);
        // Could trigger reconnection or show user notification
      }}
    >
      <WebSocketContext.Provider
        value={{
          socket: webSocketManager.getSocket(),
          isConnected,
          connectionState,
          webSocketManager,
          joinRoom,
          leaveRoom,
          connect,
          disconnect,
        }}
      >
        {children} {/* ✅ Ensures JSX is returned */}
      </WebSocketContext.Provider>
    </WebSocketErrorBoundary>
  );
};

// ✅ Custom Hook to Use WebSocket Context (Ensure Proper Export)
export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
