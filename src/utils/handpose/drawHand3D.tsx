import type * as handdetection from "@tensorflow-models/hand-pose-detection";
import React from "react";
import { Canvas, type Color } from "@react-three/fiber";
import { Vector3 } from "three";

type DrawHand3DProps = {
  predictions: handdetection.Hand[];
  height: number;
  width: number;
};

export const DrawHand3D = ({ predictions, height, width }: DrawHand3DProps) => {
  const Point = ({
    position,
    color = "orange",
  }: {
    position: { x: number; y: number; z: number };
    color?: Color;
  }) => {
    const xOffset = width / 2;
    const yOffset = height / 2;

    return (
      <mesh
        scale={0.1}
        position={
          new Vector3(
            (position.x - xOffset) / 100,
            -(position.y - yOffset) / 100,
            position.z,
          )
        }
      >
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };

  const firstHand = predictions[0];
  const secondHand = predictions[1];

  return (
    <Canvas
      camera={{
        position: new Vector3(0, 0, 275),
        rotation: [0, 0, 0],
        zoom: 1,
        fov: 1,
      }}
      style={{
        height: height,
        width: width,
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Point position={{ x: 0, y: 0, z: 0 }} />
      <Point position={{ x: 640, y: 0, z: 0 }} />
      <Point position={{ x: 0, y: 480, z: 0 }} />
      <Point position={{ x: 640, y: 480, z: 0 }} />

      {firstHand?.keypoints?.map((keypoint) => {
        return (
          <Point
            key={keypoint.name + firstHand.handedness}
            position={{ x: keypoint.x, y: keypoint.y, z: 0 }}
            color="red"
          />
        );
      })}
      {secondHand?.keypoints?.map((keypoint) => {
        return (
          <Point
            key={keypoint.name + secondHand.handedness}
            position={{ x: keypoint.x, y: keypoint.y, z: 0 }}
            color="blue"
          />
        );
      })}
    </Canvas>
  );
};
