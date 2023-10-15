/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";

import * as handdetection from "@tensorflow-models/hand-pose-detection";

import Webcam from "react-webcam";
import { drawHand2 } from "@/utils/handpose/drawHand";

const Camera = () => {
  const detectorFps = 30;
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handdetection.HandDetector>();

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
        modelType: "full",
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
    if (
      typeof webcamRef.current !== "undefined" &&
      typeof canvasRef.current !== "undefined" &&
      canvasRef.current !== null &&
      webcamRef.current?.video !== null &&
      webcamRef.current?.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      // setting canvas dimensions
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //DETECT HAND
      const hand = await model?.estimateHands(video);
      const ctx = canvasRef.current.getContext("2d");

      if (hand && ctx) {
        drawHand2(hand, ctx);
      }
    }
  };

  return (
    <div className="flex flex-1">
      <header className="relative flex-1">
        <Webcam className="flex flex-1" ref={webcamRef} />
        <canvas className="absolute left-0 top-0 flex flex-1" ref={canvasRef} />
      </header>
    </div>
  );
};

export default Camera;
