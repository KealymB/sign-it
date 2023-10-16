import type * as handdetection from "@tensorflow-models/hand-pose-detection";
import React from "react";
import { Canvas, useLoader, type Color } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Vector3 } from "three";

type DrawHand3DProps = {
  predictions: handdetection.Hand[];
  height: number;
  width: number;
};

export const DrawHand3D = ({ predictions, height, width }: DrawHand3DProps) => {
  const HandModel = () => {
    const gltf = useLoader(GLTFLoader, "./assets/hand/hand.gltf");
    return (
      <>
        <primitive object={gltf.scene} scale={10} />
      </>
    );
  };

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
        scale={0.03}
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
      orthographic
      camera={{
        position: new Vector3(0, 0, 2),
        rotation: [0, 0, 0],
        zoom: 100,
      }}
      style={{
        height: height,
        width: width,
      }}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Point position={{ x: 0, y: 0, z: 0 }} />
      <Point position={{ x: width, y: 0, z: 0 }} />
      <Point position={{ x: 0, y: height, z: 0 }} />
      <Point position={{ x: width, y: height, z: 0 }} />

      <HandModel />

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
