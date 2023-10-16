/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";

import * as handdetection from "@tensorflow-models/hand-pose-detection";

import { DrawHand3D } from "@/utils/handpose/drawHand3D";

const Camera = () => {
  const detectorFps = 30;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<handdetection.HandDetector>();
  const [predictions, setPredictions] = useState<handdetection.Hand[]>([]);

  useEffect(() => {
    if (!model) {
      loadModel().catch((error) => {
        console.log(error);
      });
    }
    if (model) {
      runHandpose();
    }
  }, [model]);

  const loadModel = async () => {
    const handPoseModel = await handdetection.createDetector(
      handdetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        maxHands: 2,
        modelType: "lite",
      },
    );
    setModel(handPoseModel);
    console.log("Handpose model loaded.");
  };

  const runHandpose = () => {
    console.log("setup detector");

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

      video.height = video.videoHeight;
      video.width = video.videoWidth;

      if (video.height === 0 || video.width === 0) {
        return;
      }

      //DETECT HAND
      const hand = await model?.estimateHands(video);
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

            videoRef.current.play().catch((error) => {
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
        <DrawHand3D predictions={predictions} height={480} width={640} />
      </div>
      <div className="flex flex-1">
        <video ref={videoRef} autoPlay playsInline height={480} width={640} />
      </div>
    </div>
  );
};

export default Camera;
