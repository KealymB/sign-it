/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import "@tensorflow/tfjs-backend-webgl";

import useDetector from "@/hooks/useDetector";
import { toast } from "react-toastify";

const Webcam = () => {
  const { updateVideoState, updateVideoDimensions, updateVideo } =
    useDetector();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.addEventListener("loadedmetadata", measureVideo);
    }

    return () => {
      window.removeEventListener("loadedmetadata", measureVideo);
    };
  }, [videoRef.current]);

  const measureVideo = () => {
    console.log("measuring video");

    if (videoRef.current?.offsetHeight && videoRef.current?.offsetWidth) {
      updateVideoDimensions({
        height: videoRef.current.offsetHeight,
        width: videoRef.current.offsetWidth,
      });

      videoRef.current.height = videoRef.current.offsetHeight;
      videoRef.current.width = videoRef.current.offsetWidth;

      updateVideoState("ready");
    }
  };

  useEffect(() => {
    // Use navigator.mediaDevices to access the user's webcam
    if (navigator.mediaDevices?.getUserMedia) {
      const constraints: MediaStreamConstraints = { video: true, audio: false };

      updateVideoState("loading");

      // Request access to the webcam
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.play().catch((error) => {
              console.error("Error playing video:", error);
              toast.error("Error playing video");
            });

            updateVideo(videoRef.current);
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
          toast.error("Unable to access webcam");
        });
    }
  }, []);

  return (
    <div
      className="flex flex-1 overflow-hidden rounded-lg shadow-lg"
      ref={videoContainerRef}
    >
      <video ref={videoRef} autoPlay playsInline height={450} width={500} />
    </div>
  );
};

export default Webcam;
