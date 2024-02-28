"use client";

import { useEffect, useRef, useState } from "react";

const STREAM_CONSTRAINTS = {
  audio: false,
  video: true,
};

export default function Home() {
  const [mediaStream, setMediaStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!mediaStream) return;
    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  const startCapture = () => {
    if (mediaStream) return;
    const handleMediaStreamError = (error) => {
      console.error("navigator.getUserMedia error:", error);
    };

    const gotLocalMediaStream = (mediaStream) => {
      setMediaStream(mediaStream);
    };

    navigator.mediaDevices
      .getUserMedia(STREAM_CONSTRAINTS)
      .then(gotLocalMediaStream)
      .catch(handleMediaStreamError);
  };

  const stopCapture = () => {
    const videoTracks = mediaStream.getVideoTracks();
    videoTracks.forEach((stream) => {
      stream.stop();
    });
    setMediaStream(null);
  };
  return (
    <>
      <video autoPlay ref={videoRef} />
      <button onClick={() => startCapture()}>開始錄製</button>
      <button onClick={() => stopCapture()}>結束錄製</button>
    </>
  );
}
