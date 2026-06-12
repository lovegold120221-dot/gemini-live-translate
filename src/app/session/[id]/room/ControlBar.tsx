"use client";

import React, { ReactNode, useState } from "react";
import {
  useLocalParticipant,
  useRoomContext,
  useIsRecording,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  CamOffIcon,
  CamOnIcon,
  CaptionsIcon,
  MicOffIcon,
  MicOnIcon,
  SecurityIcon,
  ParticipantsIcon,
  ChatIcon,
  ShareScreenIcon,
  TranslateIcon,
  RecordIcon,
  ReactionsIcon,
  MoreIcon,
  PollIcon,
  BreakoutRoomsIcon,
  CaretUpIcon,
} from "./icons";

export default function ControlBar({
  onLeave,
  activeSidebar,
  onToggleSidebar,
}: {
  onLeave: () => void;
  activeSidebar: "participants" | "captions" | "translation" | "chat" | "breakout" | null;
  onToggleSidebar: (sidebar: "participants" | "captions" | "translation" | "chat" | "breakout") => void;
}) {
  const { localParticipant, microphoneTrack, cameraTrack } = useLocalParticipant();
  const room = useRoomContext();
  const isRecording = useIsRecording();

  const micOn = !!microphoneTrack && !microphoneTrack.isMuted;
  const camOn =
    !!cameraTrack &&
    cameraTrack.source === Track.Source.Camera &&
    !cameraTrack.isMuted;
  const screenShareOn = localParticipant.isScreenShareEnabled;

  async function toggleMic() {
    await localParticipant.setMicrophoneEnabled(!micOn);
  }
  async function toggleCam() {
    await localParticipant.setCameraEnabled(!camOn);
  }
  async function toggleScreenShare() {
    await localParticipant.setScreenShareEnabled(!screenShareOn);
  }
  async function toggleRecording() {
    try {
      const res = await fetch("/api/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isRecording ? "stop" : "start", roomName: room.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
    } catch (e: any) {
      alert("Failed to toggle recording: " + e.message);
    }
  }
  function toggleBreakout() {
    onToggleSidebar("breakout");
  }
  async function leave() {
    await room.disconnect();
    onLeave();
  }

  return (
    <div className="control-bar">
      {/* ——— Left: Audio / Video ——— */}
      <div className="control-bar-left">
        <CtrlButton
          active={micOn}
          onClick={toggleMic}
          label={micOn ? "Mute" : "Unmute"}
          icon={micOn ? <MicOnIcon /> : <MicOffIcon />}
          dataMobile="primary"
          muted={!micOn}
          hasCaret
        />
        <CtrlButton
          active={camOn}
          onClick={toggleCam}
          label={camOn ? "Stop Video" : "Start Video"}
          icon={camOn ? <CamOnIcon /> : <CamOffIcon />}
          dataMobile="primary"
          hasCaret
        />
      </div>

      {/* ——— Center: Features ——— */}
      <div className="control-bar-center">
        <CtrlButton
          active={false}
          onClick={() => {}}
          label="Security"
          icon={<SecurityIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={activeSidebar === "participants"}
          onClick={() => onToggleSidebar("participants")}
          label="Participants"
          icon={<ParticipantsIcon />}
          dataMobile="overflow"
          hasCaret
        />
        {/* Mobile "People" alias */}
        <CtrlButton
          active={activeSidebar === "participants"}
          onClick={() => onToggleSidebar("participants")}
          label="People"
          icon={<ParticipantsIcon />}
          dataMobile="primary-people"
        />
        <CtrlButton
          active={activeSidebar === "chat"}
          onClick={() => onToggleSidebar("chat")}
          label="Chat"
          icon={<ChatIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={screenShareOn}
          onClick={toggleScreenShare}
          label={screenShareOn ? "Stop Sharing" : "Share Screen"}
          icon={<ShareScreenIcon />}
          dataMobile="primary-share"
          hasCaret
          className="ctrl-share"
        />
        <CtrlButton
          active={activeSidebar === "translation"}
          onClick={() => onToggleSidebar("translation")}
          label="Translate"
          icon={<TranslateIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={activeSidebar === "captions"}
          onClick={() => onToggleSidebar("captions")}
          label="Captions"
          icon={<CaptionsIcon />}
          dataMobile="overflow"
          hasCaret
        />
        <CtrlButton
          active={false}
          onClick={() => {}}
          label="Polling"
          icon={<PollIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={isRecording}
          onClick={toggleRecording}
          label="Record"
          icon={<RecordIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={activeSidebar === "breakout"}
          onClick={toggleBreakout}
          label="Breakout"
          icon={<BreakoutRoomsIcon />}
          dataMobile="overflow"
        />
        <CtrlButton
          active={false}
          onClick={() => {}}
          label="Reactions"
          icon={<ReactionsIcon />}
          dataMobile="overflow"
          hasCaret
        />
      </div>

      {/* ——— Right: Leave & More ——— */}
      <div className="control-bar-right">
        <button
          className="ctrl ctrl--warning ctrl-leave ctrl-desktop-leave"
          onClick={leave}
          title="Leave the call"
          aria-label="Leave"
        >
          Leave
        </button>
        {/* Mobile only */}
        <CtrlButton
          active={false}
          onClick={() => {}}
          label="More"
          icon={<MoreIcon />}
          dataMobile="more"
        />
      </div>
    </div>
  );
}

function CtrlButton({
  active,
  onClick,
  label,
  icon,
  dataMobile,
  hasCaret,
  muted,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  dataMobile?: string;
  hasCaret?: boolean;
  muted?: boolean;
  className?: string;
}) {
  return (
    <button
      className={`ctrl${active ? " ctrl--active" : ""}${muted ? " ctrl--muted" : ""} ${className}`.trim()}
      onClick={onClick}
      title={label}
      aria-label={label}
      data-mobile={dataMobile}
    >
      <span className="ctrl-icon-row">
        <span className="ctrl-icon">{icon}</span>
        {hasCaret && <span className="ctrl-caret"><CaretUpIcon /></span>}
      </span>
    </button>
  );
}
