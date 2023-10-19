import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import { type VideoDimensions } from "@/types/handpose";
import * as handdetection from "@tensorflow-models/hand-pose-detection";

type DetectorState = "pending" | "loading" | "ready" | "running" | "error";

type DetectorContextType = {
  videoState: DetectorState;
  modelState: DetectorState;
  detectorState: DetectorState;
  predictions: handdetection.Hand[] | undefined;
  videoDimensions: VideoDimensions | undefined;
  video: HTMLVideoElement | undefined;
  model: handdetection.HandDetector | undefined;
  updateVideoState: (state: DetectorState) => void;
  updateModelState: (state: DetectorState) => void;
  updateDetectorState: (state: DetectorState) => void;
  updatePredictions: (predictions: handdetection.Hand[]) => void;
  updateVideoDimensions: (dimensions: VideoDimensions) => void;
  updateVideo: (video: HTMLVideoElement | undefined) => void;
  updateModel: (model: handdetection.HandDetector | undefined) => void;
};

export const DetectorContext = createContext<DetectorContextType | undefined>(
  undefined,
);

type DetectorProviderProps = {
  children: ReactNode;
};

export function DetectorProvider({ children }: DetectorProviderProps) {
  const detectorFps = 20;

  const [videoState, setVideoState] = useState<DetectorState>("pending");
  const [modelState, setModelState] = useState<DetectorState>("pending");
  const [detectorState, setDetectorState] = useState<DetectorState>("ready");
  const [predictions, setPredictions] = useState<handdetection.Hand[]>();
  const [videoDimensions, setVideoDimensions] = useState<VideoDimensions>();
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [model, setModel] = useState<handdetection.HandDetector>();

  const updateVideoState = (newState: DetectorState) => setVideoState(newState);
  const updateModelState = (newState: DetectorState) => setModelState(newState);
  const updateDetectorState = (newState: DetectorState) =>
    setDetectorState(newState);
  const updatePredictions = (newPredictions: handdetection.Hand[]) =>
    setPredictions(newPredictions);
  const updateVideoDimensions = (dimensions: VideoDimensions | undefined) =>
    setVideoDimensions(dimensions);
  const updateVideo = (newVideo: HTMLVideoElement | undefined) =>
    setVideo(newVideo);
  const updateModel = (newModel: handdetection.HandDetector | undefined) =>
    setModel(newModel);

  const loadModel = useCallback(async () => {
    console.log("loading model");

    updateModelState("loading");

    const handPoseModel = await handdetection.createDetector(
      handdetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        maxHands: 2,
        modelType: "lite",
      },
    );
    updateModel(handPoseModel);
    updateModelState("ready");

    console.log("loaded model");
  }, []);

  useEffect(() => {
    if (!model && modelState === "pending") {
      loadModel().catch((error) => {
        updateModelState("error");
        console.log(error);
      });
    }
  }, [loadModel, model, modelState]);

  const detectHands = useCallback(async () => {
    if (!video || !model) {
      throw new Error("Video or model not ready");
    }
    if (!videoDimensions) {
      throw new Error("Video dimensions not update");
    }

    if (videoDimensions.height === 0 || videoDimensions.width === 0) {
      throw new Error("Video dimensions cannot be zero");
    }

    video.height = videoDimensions.height;
    video.width = videoDimensions.width;

    const hand = await model.estimateHands(video).catch((error) => {
      console.log(error);
      throw new Error("Error detecting hands");
    });

    updatePredictions(hand);
  }, [model, video, videoDimensions]);

  const startDetector = useCallback(() => {
    console.log("starting detector");

    updateDetectorState("running");

    const detectInterval = async () => {
      try {
        await detectHands();
      } catch (error) {
        console.log(error);
        clearInterval(intervalId);
        updateDetectorState("error");
      }
    };

    const intervalId = setInterval(detectInterval, (1 / detectorFps) * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [detectHands]);

  useEffect(() => {
    const canStartDetector =
      videoState === "ready" &&
      modelState === "ready" &&
      detectorState === "ready";

    if (canStartDetector) {
      startDetector();
    }
  }, [videoState, modelState, detectorState, startDetector]);

  return (
    <DetectorContext.Provider
      value={{
        videoState,
        modelState,
        detectorState,
        predictions,
        videoDimensions,
        video,
        model,
        updateVideoState,
        updateModelState,
        updateDetectorState,
        updatePredictions,
        updateVideoDimensions,
        updateVideo,
        updateModel,
      }}
    >
      {children}
    </DetectorContext.Provider>
  );
}
