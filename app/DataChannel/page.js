"use client";

import { useEffect, useRef } from "react";
import start from "../utils/start";

const STREAM_CONSTRAINTS = {
  audio: false,
  video: true,
};

const OFFER_OPTIONS = {
  offerToReceiveVideo: true,
};

const DataChannel = () => {
  const datachannelRef = useRef(null);
  const submitBoxRef = useRef(null);
  const receiveBoxRef = useRef(null);

  useEffect(() => {
    let localPeer, remotePeer;

    const initLocalPeer = () => {
      const peer = new RTCPeerConnection();
      peer.onicecandidate = async (e) => {
        try {
          await remotePeer.addIceCandidate(e.candidate);
          console.log("local Peer onIceCandidate", peer);
        } catch {
          console.log("local Peer onIceCandidate fail");
        }
      };
      return peer;
    };

    const initRemotePeer = () => {
      const peer = new RTCPeerConnection();
      peer.onicecandidate = async (e) => {
        try {
          await localPeer.addIceCandidate(e.candidate);
          console.log("remote Peer onIceCandidate", peer);
        } catch {
          console.log("remote local Peer onIceCandidate fail");
        }
      };
      return peer;
    };

    const connect = async () => {
      try {
        localPeer = initLocalPeer();
        const datachannel = localPeer.createDataChannel("my local channel", {
          // protocol: "json",
        });
        datachannel.onopen = (e) => console.log("datachannel open", e);
        datachannel.onclose = (e) => console.log("datachannel close", e);
        datachannelRef.current = datachannel;

        remotePeer = initRemotePeer();
        remotePeer.ondatachannel = (e) => {
          const receiveChannel = e.channel;
          receiveChannel.onopen = (e) => console.log("receiveChannel open", e);
          receiveChannel.onclose = (e) =>
            console.log("receiveChannel close", e);

          receiveChannel.onmessage = (e) => {
            receiveBoxRef.current.value = e.data;
          };
        };

        const offer = await localPeer.createOffer(OFFER_OPTIONS);
        await localPeer.setLocalDescription(offer);
        await remotePeer.setRemoteDescription(offer);

        const answer = await remotePeer.createAnswer();
        await remotePeer.setLocalDescription(answer);
        await localPeer.setRemoteDescription(answer);
      } catch (error) {
        console.log("Peer to peer connect fail!!", error);
      }
    };

    connect();

    return () => {
      localPeer.close();
      remotePeer.close();
    };
  }, []);

  const handleSubmit = () => {
    datachannelRef.current.send(submitBoxRef.current.value);
  };

  return (
    <div id="container">
      <textarea ref={submitBoxRef}></textarea>
      <textarea ref={receiveBoxRef}></textarea>

      <div id="buttons">
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default DataChannel;
