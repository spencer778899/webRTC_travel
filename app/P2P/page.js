"use client";

import { useRef } from "react";

const P2P = () => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  return (
    <>
      <h1>RTCPeerConnection 範例</h1>
      {/* 加入 tailwind */}
      <h1>PC 1 Tracker</h1>
      <video ref={localVideo} autoPlay muted />
      <h1>PC 2 Tracker</h1>
      <video ref={remoteVideo} autoPlay muted />
      <button>Start</button>
      <button>Call</button>
      <button>Hang Up</button>
    </>
  );
};

export default P2P;
