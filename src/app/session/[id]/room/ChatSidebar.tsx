"use client";

import { useChat } from "@livekit/components-react";
import { useState, useRef, useEffect } from "react";

export default function ChatSidebar({ onClose }: { onClose: () => void }) {
  const { send, chatMessages } = useChat();
  const [message, setMessage] = useState("");
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <span>Chat</span>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close Chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      
      <div ref={bodyRef} className="sidebar-body" style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {chatMessages.length === 0 ? (
          <div style={{ color: "var(--fg-ghost)", fontSize: "12px", textAlign: "center", marginTop: "20px" }}>
            No messages yet. Say hi!
          </div>
        ) : (
          chatMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--fg-tertiary)" }}>
                <strong>{msg.from?.name || msg.from?.identity || "Unknown"}</strong>
                <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div style={{ background: "rgba(255, 255, 255, 0.05)", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", lineHeight: 1.4 }}>
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "4px",
              padding: "8px 12px",
              color: "white",
              fontSize: "13px"
            }}
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            style={{
              background: message.trim() ? "var(--accent)" : "rgba(255, 255, 255, 0.1)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0 12px",
              cursor: message.trim() ? "pointer" : "default",
              fontWeight: 600,
              fontSize: "12px"
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
