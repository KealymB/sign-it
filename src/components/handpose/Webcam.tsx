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
    window.addEventListener("resize", measureVideo);
    return () => {
      window.removeEventListener("resize", measureVideo);
    };
  }, []);

  useEffect(() => {
    // Use navigator.mediaDevices to access the user's webcam
    if (navigator.mediaDevices?.getUserMedia) {
      const constraints = { video: true };

      updateVideoState("loading");

      // Request access to the webcam
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current
              .play()
              .then(() => {
                if (!measureVideo()) {
                  throw new Error("Unable to read video dimensions");
                }

                updateVideoState("ready");
              })
              .catch((error) => {
                console.error("Error playing video:", error);
                toast.error("Error playing video");
              });

            updateVideo(videoRef.current);
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    }
  }, []);

  const measureVideo = () => {
    if (videoContainerRef.current) {
      const height = videoContainerRef.current?.clientHeight;
      const width = videoContainerRef.current?.clientWidth;

      if (height && width) {
        updateVideoDimensions({
          height,
          width,
        });

        console.info("video dimensions:", height, width);

        return {
          height,
          width,
        };
      }
    }
  };

  return (
    <div className="flex flex-1" ref={videoContainerRef}>
      <video ref={videoRef} autoPlay playsInline height={450} width={500} />
    </div>
  );
};

export default Webcam;
