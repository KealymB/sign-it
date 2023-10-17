/* eslint-disable @typescript-eslint/no-unsafe-call */
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
  // const handModel = useLoader(GLTFLoader, "/assets/hand/hand.gltf");

  // const HandModel = ({
  //   position,
  // }: {
  //   position: { x: number; y: number; z: number };
  // }) => {
  //   if (!handModel?.nodes?.Sketchfab_Scene) {
  //     console.log("no hand model");
  //     return <></>;
  //   }

  //   return (
  //     <group dispose={null}>
  //       <mesh
  //         castShadow
  //         receiveShadow
  //         geometry={handModel?.nodes?.Sketchfab_Scene?.geometries}
  //         material={handModel.nodes.Sketchfab_Scene.materials}
  //         position={[0, 0.189, -0.043]}
  //       />
  //     </group>
  //   );
  // };

  const Point = ({
    position,
    color = "orange",
  }: {
    position: { x: number; y: number; z: number };
    color?: Color;
  }) => {
    const scale = 1 / 100;
    const xOffset = width / 2;
    const yOffset = height / 2;

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

      {firstHand?.keypoints?.map((keypoint) => {
        return (
          <Point
            key={keypoint.name + firstHand.handedness}
            position={{ x: keypoint.x, y: keypoint.y, z: keypoint.z ?? 0 }}
            color="red"
          />
        );
      })}
      {secondHand?.keypoints?.map((keypoint) => {
        return (
          <Point
            key={keypoint.name + secondHand.handedness}
            position={{ x: keypoint.x, y: keypoint.y, z: keypoint.z ?? 0 }}
            color="blue"
          />
        );
      })}
    </Canvas>
  );
};
