"use client";
import React from "react";
import Alert from "@/components/ui/alert/Alert";
import { websocketService } from "@/services/websocket";

export default function RealtimeSecuritySnackbar() {
  const [securityMessage, setSecurityMessage] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Ensure connection and subscribe to security events
    websocketService.subscribeToSecurityEvents("failed_login");
    websocketService.ensureConnection();

    const handler = (msg: any) => {
      const data = msg?.data || {};
      const ip = data.ip_address || data.ipAddress || "unknown";
      const attempts = data.attempts || 0;
      setSecurityMessage(`Multiple failed login attempts detected from IP ${ip} (${attempts} attempts)`);
      setVisible(true);
      // Auto-hide after 10s
      const t = setTimeout(() => setVisible(false), 10000);
      return () => clearTimeout(t);
    };

    websocketService.onSecurityEvent(handler);
    return () => {
      websocketService.off("message", handler as any);
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


