"use client";

import type { RemoteParticipant } from "livekit-client";
import ParticipantTile from "./ParticipantTile";

export default function ParticipantsPanel({
  participants,
  myLang,
  isHost,
  roomName,
  onClose,
}: {
  participants: RemoteParticipant[];
  myLang: string;
  isHost: boolean;
  roomName: string;
  onClose: () => void;
}) {
  return (
    <div className="sidebar-panel">
      <div className="sidebar-header">
        <span>Participants ({participants.length + 1})</span>
        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close Participants"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <div className="sidebar-body">
        {participants.map((p) => (
          <ParticipantTile key={p.identity} participant={p} myLang={myLang} isHost={isHost} roomName={roomName} />
        ))}
      </div>
    </div>
  );
}
