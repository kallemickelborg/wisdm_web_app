"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * WebSocket Channel Context
 *
 * Replaces Redux userSlice's current_channel state with React Context
 * for managing the current WebSocket channel/room.
 */

interface WebSocketChannelContextType {
  currentChannel: string | null;
  setCurrentChannel: (channel: string | null) => void;
}

const WebSocketChannelContext = createContext<
  WebSocketChannelContextType | undefined
>(undefined);

export function WebSocketChannelProvider({ children }: { children: ReactNode }) {
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);

  return (
    <WebSocketChannelContext.Provider
      value={{ currentChannel, setCurrentChannel }}
    >
      {children}
    </WebSocketChannelContext.Provider>
  );
}

export function useWebSocketChannel() {
  const context = useContext(WebSocketChannelContext);
  if (context === undefined) {
    throw new Error(
      "useWebSocketChannel must be used within a WebSocketChannelProvider"
    );
  }
  return context;
}

