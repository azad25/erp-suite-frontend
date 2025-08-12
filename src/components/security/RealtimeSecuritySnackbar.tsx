"use client";
import React from "react";
import Alert from "@/components/ui/alert/Alert";
import { websocketService, type WebSocketMessage } from "@/services/websocket";

export default function RealtimeSecuritySnackbar() {
  const [securityMessage, setSecurityMessage] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Ensure connection and subscribe to security events
    // Initializing WebSocket connection and subscribing to security events
    websocketService.subscribeToSecurityEvents("failed_login");
    websocketService.ensureConnection();

    const handler = (msg: WebSocketMessage) => {
      // Received security event
      const data = (msg?.data ?? {}) as Record<string, unknown>;
      const ip =
        (typeof data["ip_address"] === "string" && (data["ip_address"] as string)) ||
        (typeof data["ipAddress"] === "string" && (data["ipAddress"] as string)) ||
        (typeof data["ip"] === "string" && (data["ip"] as string)) ||
        "unknown";
      const attempts = typeof data["attempts"] === "number" ? (data["attempts"] as number) : 1;
      
      // Showing security alert
      setSecurityMessage(`Multiple failed login attempts detected from IP ${ip} (${attempts} attempts)`);
      setVisible(true);
      
      // Auto-hide after 10s
      const t = setTimeout(() => {
        // Auto-hiding security alert
        setVisible(false);
      }, 10000);
      return () => clearTimeout(t);
    };

    const unsubscribe = websocketService.onSecurityEvent(handler, "failed_login");
    
    // Also listen for general WebSocket connection events for debugging
    const connectionHandler = () => {
      // WebSocket connected
    };
    const disconnectionHandler = () => {
      // WebSocket disconnected
    };
    
    websocketService.on('connected', connectionHandler);
    websocketService.on('disconnected', disconnectionHandler);
    
    return () => {
      // Cleaning up event listeners
      unsubscribe();
      websocketService.off('connected', connectionHandler);
      websocketService.off('disconnected', disconnectionHandler);
    };
  }, []);

  if (!visible || !securityMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 w-[min(90vw,640px)]">
      <Alert variant="warning" title="Security Alert" message={securityMessage} />
      <div className="mt-2 flex justify-end">
        <button
          onClick={() => setVisible(false)}
          className="text-xs text-gray-600 underline dark:text-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}


