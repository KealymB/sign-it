import React, { useEffect, useRef, useState } from "react";
import { Canvas, type Color } from "@react-three/fiber";
import { Vector3 } from "three";

import useDetector from "@/hooks/useDetector";

const Visualizer3D = () => {
  const { predictions, videoDimensions, detectorState } = useDetector();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraZPosition, setCameraZPosition] = useState<number>(0);

  //TODO: replace with more efficient method
  const leftHand = predictions?.find((prediction) => {
    return prediction.handedness === "Left";
  });
  const rightHand = predictions?.find((prediction) => {
    return prediction.handedness === "Right";
  });

  useEffect(() => {
    setCameraZPosition(videoDimensions.width / 2 / 1.02041);
  }, [videoDimensions]);

  const Sphere = ({
    position,
    color = "orange",
  }: {
    position: { x: number; y: number; z: number };
    color?: Color;
  }) => {
    const scale = 1 / 100;
    const xOffset = videoDimensions.width / 2;
    const yOffset = videoDimensions.height / 2;

    return (
      <mesh
        scale={0.03}
        position={
          new Vector3(
            (position.x - xOffset) * scale,
            -(position.y - yOffset) * scale,
            position.z * scale,
          )
        }
      >
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  if (detectorState != "running") {
    return <></>;
  }

  return (
    <Canvas
      ref={canvasRef}
      camera={{
        position: new Vector3(0, 0, cameraZPosition),
        rotation: [0, 0, 0],
        zoom: 100,
      }}
      style={{
        height: videoDimensions.height,
        width: videoDimensions.width,
      }}
    >
      <ambientLight />

      {leftHand?.keypoints?.map((keypoint) => {
        return (
          <Sphere
            key={keypoint.name + "Left"}
            position={{ x: keypoint.x, y: keypoint.y, z: keypoint.z ?? 0 }}
            color="red"
          />
        );
      })}
      {rightHand?.keypoints?.map((keypoint) => {
        return (
          <Sphere
            key={keypoint.name + "Right"}
            position={{ x: keypoint.x, y: keypoint.y, z: keypoint.z ?? 0 }}
            color="blue"
          />
        );
      })}
    </Canvas>
  );
};

export default Visualizer3D;
