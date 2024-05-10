const start = async (constraint) => {
  const handleMediaStreamError = (error) => {
    console.error("navigator.getUserMedia error:", error);
  };

  const gotLocalMediaStream = (mediaStream) => {
    return mediaStream;
  };
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
    return gotLocalMediaStream(mediaStream);
  } catch (error) {
    handleMediaStreamError(error);
    return null;
  }
};

export default start;
