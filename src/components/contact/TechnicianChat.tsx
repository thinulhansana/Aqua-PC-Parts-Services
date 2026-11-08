"use client";

import React, { useState } from "react";

export default function TechnicianChat() {
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "Lead Engineer Marcus",
      text: "Bench #2 ready. Is your custom D5 pump receiving PWM tach signal from header 1?",
      time: "Just now",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setChatMessages((prev) => [
      ...prev,
      { sender: "You", text: userText, time: "Just now" },
    ]);
    setInputMsg("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "Lead Engineer Marcus",
          text: `Telemetry acknowledged for: "${userText}". Our diagnostic team is monitoring rail status.`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-space-lg sm:p-space-xl shadow-xl flex flex-col justify-between gap-space-lg relative overflow-hidden border border-outline-variant/20 h-full">
      <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      <div>
        <div className="flex items-center gap-space-xs mb-space-xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
          <span className="font-mono text-label-tech text-secondary">
            3 TECHNICIANS ON ACTIVE CONSOLE
          </span>
        </div>
        <h3 className="font-syne text-headline-md text-on-surface">
          Immediate Live Engineering Chat
        </h3>
        <p className="text-body-md text-on-surface-variant mt-space-xs">
          Need real-time troubleshooting on cold boot loops, component clearances, or liquid fittings compatibility? Chat directly with an engineer at the Austin facility.
        </p>
      </div>

      {/* Chat Preview Simulator */}
      <div className="bg-surface-container rounded-lg p-space-md flex flex-col gap-space-sm border border-outline-variant/15">
        <div className="flex flex-col gap-space-sm max-h-48 overflow-y-auto">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-space-sm">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                  msg.sender === "You"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {msg.sender === "You" ? "ME" : "LC"}
              </div>
              <div className="bg-surface-container-high rounded-lg p-space-sm max-w-sm">
                <span className="font-mono text-[11px] text-primary block font-semibold">
                  {msg.sender}
                </span>
                <span className="text-body-sm text-on-surface">
                  {msg.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendChat} className="flex gap-space-xs pt-space-xs">
          <input
            type="text"
            placeholder="Type a message to the lab technician..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="w-full px-space-md py-space-xs rounded bg-surface-container-high text-on-surface text-body-sm placeholder:text-outline border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-space-md py-space-xs rounded bg-primary text-on-primary font-syne text-body-sm hover:bg-primary-fixed-dim"
          >
            Send
          </button>
        </form>

        <div className="flex items-center gap-space-xs pt-space-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-outline" />
          <span className="font-mono text-label-tech text-outline">
            Average live response: &lt; 90 seconds
          </span>
        </div>
      </div>
    </div>
  );
}
