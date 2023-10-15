import type * as handdetection from "@tensorflow-models/hand-pose-detection";

const fingerJoints = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
};

export const drawHand2 = (
  predictions: handdetection.Hand[],
  ctx: CanvasRenderingContext2D,
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const { keypoints } = prediction;

      // draw tendons

      Object.keys(fingerJoints).forEach((finger) => {
        const fingerIndex = fingerJoints[finger as keyof typeof fingerJoints];
        for (let k = 0; k < fingerIndex.length - 1; k++) {
          // Get pairs of joints
          const firstJointIndex = fingerIndex[k]!;
          const secondJointIndex = fingerIndex[k + 1]!;

          // Draw path
          ctx.beginPath();
          ctx.moveTo(
            keypoints[firstJointIndex]!.x,
            keypoints[firstJointIndex]!.y,
          );
          ctx.lineTo(
            keypoints[secondJointIndex]!.x,
            keypoints[secondJointIndex]!.y,
          );
          ctx.strokeStyle = "plum";
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      });

      //draw points
      keypoints.forEach((keypoint) => {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 3 * Math.PI);

        ctx.fillStyle = "black";
        ctx.fill();
      });
    });
  }
};
