"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const STREAM_CONSTRAINTS = {
  audio: false,
  video: true,
};

export default function Home() {
  const [mediaStream, setMediaStream] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
      videoRef.current.srcObject = null;
    });
    setMediaStream(null);
  };

  const makeScreenshot = () => {
    if (!mediaStream) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    console.log(canvasRef.current);
    canvasRef.current
      .getContext("2d")
      .drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
    // setImgUrl(canvasRef.current.toDataURL("image/png"));
  };

  return (
    <>
      <video autoPlay ref={videoRef} controls />
      <button onClick={() => startCapture()}>開始錄製</button>
      <br />
      <canvas ref={canvasRef} />
      {/* {imgUrl && (
        <Image
          src={imgUrl}
          width={canvasRef.current.width}
          height={canvasRef.current.height}
          alt="Picture of the author"
        />
      )} */}
      <button onClick={() => makeScreenshot()}>視訊截圖</button>
    </>
  );
}
