"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const videoRef = useRef(null);
  useEffect(() => {
    const mediaStreamConstraints = {
      audio: true,
      video: true,
    };

    const handleMediaStreamError = (error) => {
      console.error("navigator.getUserMedia error:", error);
    };

    const gotLocalMediaStream = (mediaStream) => {
      videoRef.current.srcObject = mediaStream;
    };

    navigator.mediaDevices
      .getUserMedia(mediaStreamConstraints)
      .then(gotLocalMediaStream)
      .catch(handleMediaStreamError);
  }, []);
  return <video autoPlay ref={videoRef} />;
}
