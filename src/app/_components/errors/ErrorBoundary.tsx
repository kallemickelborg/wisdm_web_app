/**
 * Error Boundary Components
 * 
 * React error boundaries to catch and handle JavaScript errors
 * in component trees with graceful fallback UI.
 */

"use client";

import React, { Component, ReactNode } from "react";

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Generic Error Boundary Component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error("Error Boundary caught an error:", error);
    console.error("Error Info:", errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error monitoring service (e.g., Sentry)
    // reportError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{
          padding: "20px",
          margin: "20px",
          border: "1px solid #ff6b6b",
          borderRadius: "8px",
          backgroundColor: "#fff5f5",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#d63031", marginBottom: "16px" }}>
            ⚠️ Something went wrong
          </h2>
          <p style={{ color: "#636e72", marginBottom: "16px" }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              backgroundColor: "#0984e3",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#636e72",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
          
          {process.env.NODE_ENV === "development" && (
            <details style={{ marginTop: "20px", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", color: "#636e72" }}>
                Error Details (Development Only)
              </summary>
              <pre style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "4px",
                overflow: "auto",
                fontSize: "12px",
                color: "#495057"
              }}>
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * WebSocket-specific Error Boundary
 */
interface WebSocketErrorBoundaryProps {
  children: ReactNode;
  onWebSocketError?: (error: Error) => void;
}

export class WebSocketErrorBoundary extends Component<WebSocketErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: WebSocketErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("WebSocket Error Boundary caught an error:", error);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onWebSocketError) {
      this.props.onWebSocketError(error);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "20px",
          margin: "20px",
          border: "1px solid #fdcb6e",
          borderRadius: "8px",
          backgroundColor: "#ffeaa7",
          textAlign: "center"
        }}>
          <h3 style={{ color: "#e17055", marginBottom: "16px" }}>
            🔌 WebSocket Connection Error
          </h3>
          <p style={{ color: "#636e72", marginBottom: "16px" }}>
            There was an issue with the real-time connection. Some features may not work properly.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              backgroundColor: "#fdcb6e",
              color: "#2d3436",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Retry Connection
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Timeline-specific Error Boundary
 */
interface TimelineErrorBoundaryProps {
  children: ReactNode;
  timelineId?: string;
  onTimelineError?: (error: Error, timelineId?: string) => void;
}

export class TimelineErrorBoundary extends Component<TimelineErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: TimelineErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Timeline Error Boundary caught an error:", error);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onTimelineError) {
      this.props.onTimelineError(error, this.props.timelineId);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "20px",
          margin: "10px",
          border: "1px solid #e17055",
          borderRadius: "8px",
          backgroundColor: "#fab1a0",
          textAlign: "center"
        }}>
          <h4 style={{ color: "#d63031", marginBottom: "12px" }}>
            📰 Timeline Loading Error
          </h4>
          <p style={{ color: "#2d3436", marginBottom: "12px", fontSize: "14px" }}>
            Unable to load timeline content. Please try again.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              backgroundColor: "#e17055",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
