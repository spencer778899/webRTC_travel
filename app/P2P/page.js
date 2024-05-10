"use client";

import { useEffect, useRef, useState } from "react";
import start from "../utils/start";

const STREAM_CONSTRAINTS = {
  audio: false,
  video: true,
};

const OFFER_OPTIONS = {
  offerToReceiveVideo: true,
};

const P2P = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    let localPeer, remotePeer;

    const initLocalPeer = () => {
      const peer = new RTCPeerConnection();
      peer.oniceconnectionstatechange = (e) => {
        console.log("local Peer ICE state change:", e);
      };
      peer.onicecandidate = async (e) => {
        try {
          // by signalling
          console.log("test e.candidate", e.candidate);
          await remotePeer.addIceCandidate(e.candidate);
          //
          console.log("local Peer onIceCandidate", peer);
        } catch {
          console.log("local Peer onIceCandidate fail");
        }
      };
      return peer;
    };

    const initRemotePeer = () => {
      // Notion
      const peer = new RTCPeerConnection();
      peer.oniceconnectionstatechange = (e) => {
        console.log("remote Peer ICE state change:", e);
      };
      peer.onicecandidate = async (e) => {
        // by signalling
        await localPeer.addIceCandidate(e.candidate);
        //
        console.log("remote Peer onIceCandidate", peer);
      };
      peer.ontrack = (e) => {
        if (remoteVideoRef.current.srcObject !== e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
          console.log("remotePeer.ontrack");
        }
      };
      return peer;
    };

    const connect = async () => {
      try {
        const localStream = await start(STREAM_CONSTRAINTS);
        localVideoRef.current.srcObject = localStream;

        localPeer = initLocalPeer();
        remotePeer = initRemotePeer();

        // 將 local stream 增加到 Peer 中，讓他可以隨著 Peer 傳輸
        localStream
          .getTracks()
          .forEach((track) => localPeer.addTrack(track, localStream));

        const offer = await localPeer.createOffer(OFFER_OPTIONS);
        await localPeer.setLocalDescription(offer);

        // by signalling
        await remotePeer.setRemoteDescription(offer);
        //

        const answer = await remotePeer.createAnswer();
        await remotePeer.setLocalDescription(answer);

        // by signalling
        await localPeer.setRemoteDescription(answer);
        //
      } catch (error) {
        console.log("Peer to peer connect fail!!", error);
      }
    };

    connect();
    return () => {
      // 清理操作，例如关闭连接
      localPeer.close();
      remotePeer.close();
    };
  }, []);

  return (
    <>
      <h1>RTCPeerConnection 範例</h1>
      {/* 加入 tailwind */}
      <h1>Local</h1>
      <video
        ref={localVideoRef}
        style={{ width: "640px", height: "480px" }}
        autoPlay
      />
      <h1>Remote</h1>
      <video
        ref={remoteVideoRef}
        style={{ width: "640px", height: "480px" }}
        autoPlay
      />
      <button>Start</button>
      <button>Call</button>
      <button>Hang Up</button>
    </>
  );
};

export default P2P;
