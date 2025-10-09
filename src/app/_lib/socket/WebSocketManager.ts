/**
 * WebSocket Connection Manager
 *
 * A centralized class for managing WebSocket connections with proper
 * error handling, reconnection logic, and event management.
 */

import { io, Socket } from "socket.io-client";

// Simple console logger to replace the removed Logger
const logger = {
  info: (message: string, data?: any) =>
    console.log(`[WebSocket] ${message}`, data || ""),
  warn: (message: string, data?: any) =>
    console.warn(`[WebSocket] ${message}`, data || ""),
  error: (message: string, data?: any) =>
    console.error(`[WebSocket] ${message}`, data || ""),
  debug: (message: string, data?: any) =>
    console.debug(`[WebSocket] ${message}`, data || ""),
  webSocketConnectionStarted: () =>
    console.log("[WebSocket] Connection started"),
  webSocketConnectionSuccess: () =>
    console.log("[WebSocket] Connection successful"),
  webSocketDisconnected: (reason?: string) =>
    console.log(`[WebSocket] Disconnected: ${reason || "Unknown reason"}`),
  webSocketConnectionFailed: (error?: any) =>
    console.error("[WebSocket] Connection failed:", error),
};

export enum ConnectionState {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  RECONNECTING = "RECONNECTING",
  ERROR = "ERROR",
}

export interface WebSocketConfig {
  url: string;
  transports?: string[];
  timeout?: number;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
  autoConnect?: boolean;
}

export interface ConnectionEventHandlers {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: any) => void;
  onReconnect?: (attemptNumber: number) => void;
  onReconnectError?: (error: any) => void;
  onReconnectFailed?: () => void;
}

export class WebSocketManager {
  private socket: Socket | null = null;
  private config: WebSocketConfig;
  private eventHandlers: Map<string, Function[]> = new Map();
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
  private connectionStateCallbacks: ((state: ConnectionState) => void)[] = [];
  private reconnectAttempts: number = 0; // Used in event listeners
  private maxReconnectAttempts: number;

  constructor(config: WebSocketConfig) {
    this.config = {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      autoConnect: false,
      ...config,
    };

    this.maxReconnectAttempts = this.config.reconnectionAttempts || 5;
  }

  /**
   * Initialize the WebSocket connection
   */
  public initialize(): void {
    if (this.socket) {
      console.warn("WebSocket already initialized");
      return;
    }

    console.log("🌐 Initializing WebSocket connection...");

    this.socket = io(this.config.url, {
      autoConnect: this.config.autoConnect,
      transports: this.config.transports,
      timeout: this.config.timeout,
      reconnection: this.config.reconnection,
      reconnectionDelay: this.config.reconnectionDelay,
      reconnectionAttempts: this.config.reconnectionAttempts,
      forceNew: true,
    });

    this.setupEventListeners();
  }

  /**
   * Connect to the WebSocket server
   */
  public connect(): void {
    if (!this.socket) {
      this.initialize();
    }

    if (this.socket?.connected) {
      logger.info("WebSocket", "Already connected");
      this.updateConnectionState(ConnectionState.CONNECTED);
      return;
    }

    logger.webSocketConnectionStarted();
    this.updateConnectionState(ConnectionState.CONNECTING);
    this.socket?.connect();
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting from WebSocket server...");
      this.socket.disconnect();
      this.updateConnectionState(ConnectionState.DISCONNECTED);
    }
  }

  /**
   * Destroy the WebSocket connection and clean up resources
   */
  public destroy(): void {
    console.log("🗑️ Destroying WebSocket connection...");

    if (this.socket) {
      this.removeAllEventListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.eventHandlers.clear();
    this.connectionStateCallbacks = [];
    this.updateConnectionState(ConnectionState.DISCONNECTED);
  }

  /**
   * Add an event listener
   */
  public addEventListener(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }

    this.eventHandlers.get(event)?.push(handler);

    if (this.socket) {
      this.socket.on(event, handler as any);
    }
  }

  /**
   * Remove an event listener
   */
  public removeEventListener(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }

    if (this.socket) {
      this.socket.off(event, handler as any);
    }
  }

  /**
   * Remove all event listeners for a specific event
   */
  public removeAllEventListeners(event?: string): void {
    if (event) {
      this.eventHandlers.delete(event);
      if (this.socket) {
        this.socket.removeAllListeners(event);
      }
    } else {
      this.eventHandlers.clear();
      if (this.socket) {
        this.socket.removeAllListeners();
      }
    }
  }

  /**
   * Emit an event to the server
   */
  public emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit '${event}': WebSocket not connected`);
    }
  }

  /**
   * Join a room
   */
  public joinRoom(room: string): void {
    console.log(`📢 Joining room: ${room}`);
    this.emit("join_room", { room });
  }

  /**
   * Leave a room
   */
  public leaveRoom(room: string): void {
    console.log(`📤 Leaving room: ${room}`);
    this.emit("leave_room", { room });
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return (
      this.connectionState === ConnectionState.CONNECTED &&
      this.socket?.connected === true
    );
  }

  /**
   * Subscribe to connection state changes
   */
  public onConnectionStateChange(
    callback: (state: ConnectionState) => void
  ): void {
    this.connectionStateCallbacks.push(callback);
  }

  /**
   * Get the underlying socket instance (use with caution)
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Setup internal event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      logger.webSocketConnectionSuccess();
      this.reconnectAttempts = 0;
      this.updateConnectionState(ConnectionState.CONNECTED);
    });

    this.socket.on("disconnect", (reason: string) => {
      logger.webSocketDisconnected(reason);
      this.updateConnectionState(ConnectionState.DISCONNECTED);
    });

    this.socket.on("connect_error", (error: any) => {
      logger.webSocketConnectionFailed(error);
      this.updateConnectionState(ConnectionState.ERROR);
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log(
        `🔄 Reconnected to WebSocket server (attempt ${attemptNumber})`
      );
      this.reconnectAttempts = 0;
      this.updateConnectionState(ConnectionState.CONNECTED);
    });

    this.socket.on("reconnect_attempt", (attemptNumber: number) => {
      console.log(
        `🔄 Attempting to reconnect... (${attemptNumber}/${this.maxReconnectAttempts})`
      );
      this.reconnectAttempts = attemptNumber;
      this.updateConnectionState(ConnectionState.RECONNECTING);
    });

    this.socket.on("reconnect_error", (error: any) => {
      console.error("❌ Reconnection error:", error);
      this.updateConnectionState(ConnectionState.ERROR);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("❌ Failed to reconnect to WebSocket server");
      this.updateConnectionState(ConnectionState.ERROR);
    });
  }

  /**
   * Update connection state and notify callbacks
   */
  private updateConnectionState(newState: ConnectionState): void {
    if (this.connectionState !== newState) {
      const oldState = this.connectionState;
      this.connectionState = newState;

      console.log(`🔄 Connection state changed: ${oldState} → ${newState}`);

      // Notify all callbacks
      this.connectionStateCallbacks.forEach((callback) => {
        try {
          callback(newState);
        } catch (error) {
          console.error("Error in connection state callback:", error);
        }
      });
    }
  }
}
