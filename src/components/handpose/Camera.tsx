/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";

import * as handdetection from "@tensorflow-models/hand-pose-detection";

import { DrawHand3D } from "@/utils/handpose/drawHand3D";

const Camera = () => {
  const detectorFps = 30;
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isDetectorReady, setDetectorReady] = useState(false);
  const [model, setModel] = useState<handdetection.HandDetector>();
  const [predictions, setPredictions] = useState<handdetection.Hand[]>([]);
  const [videoDimensions, setVideoDimensions] = useState({
    height: 480,
    width: 640,
  });

  useEffect(() => {
    if (!model) {
      loadModel().catch((error) => {
        console.log(error);
      });
    }
  }, []);

  useEffect(() => {
    if (isDetectorReady && model) {
      startDetector();
    }
  }, [model, isDetectorReady]);

  useEffect(() => {
    window.addEventListener("resize", measureVideo);
    return () => {
      window.removeEventListener("resize", measureVideo);
    };
  }, []);

  const measureVideo = () => {
    if (videoContainerRef.current) {
      const height = videoContainerRef.current?.clientHeight;
      const width = videoContainerRef.current?.clientWidth;

      if (height && width) {
        setVideoDimensions({
          height,
          width,
        });
        console.log("video dimensions", height, width);
      }
    }
  };

  const loadModel = async () => {
    console.log("loading model");
    const handPoseModel = await handdetection.createDetector(
      handdetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        maxHands: 2,
        modelType: "full",
      },
    );
    setModel(handPoseModel);
    console.log("loaded model");
  };

  const startDetector = () => {
    console.log("setting up detector");

    const detectInterval = async () => {
      await detectHands();
    };

    const intervalId = setInterval(detectInterval, (1 / detectorFps) * 1000);

    return () => {
      clearInterval(intervalId);
    };
  };

  const detectHands = async () => {
    if (typeof videoRef.current !== "undefined" && videoRef.current !== null) {
      const video = videoRef.current;

      video.height = videoDimensions.height;
      video.width = videoDimensions.width;

      if (videoDimensions.height === 0 || videoDimensions.width === 0) {
        return;
      }

      //DETECT HAND
      const hand = await model?.estimateHands(video).catch((error) => {
        console.log(error);
      });
      console.log("hand", model);

      if (hand) {
        setPredictions(hand);
      }
    }
  };

  useEffect(() => {
    // Use navigator.mediaDevices to access the user's webcam
    if (navigator.mediaDevices?.getUserMedia) {
      const constraints = { video: true };

      // Request access to the webcam
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current
              .play()
              .then(() => {
                measureVideo();
                setDetectorReady(true);
              })
              .catch((error) => {
                console.error("Error playing video:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    }
  }, []);

  return (
    <div className="flex flex-1">
      <div className="absolute flex flex-1">
        <DrawHand3D
          predictions={predictions}
          height={videoDimensions.height}
          width={videoDimensions.width}
        />
      </div>
      <div className="flex flex-1" ref={videoContainerRef}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          height={videoDimensions.height}
          width={videoDimensions.width}
        />
      </div>
    </div>
  );
};

export default Camera;
