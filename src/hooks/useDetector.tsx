import { useContext } from "react";
import { DetectorContext } from "./DetectorProvider";

const useDetector = () => {
  const context = useContext(DetectorContext);
  if (!context) {
    throw new Error("useDetector must be used within a DetectorProvider");
  }

  const {
    detectorState,
    predictions,
    updatePredictions,
    videoDimensions,
    updateVideo,
    updateVideoDimensions,
    updateVideoState,
    updateModelState,
  } = context;

  return {
    videoDimensions,
    detectorState,
    predictions,
    updatePredictions,
    updateVideo,
    updateVideoDimensions,
    updateVideoState,
    updateModelState,
  };
};

export default useDetector;
