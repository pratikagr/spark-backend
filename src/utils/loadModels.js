import * as faceapi from "face-api.js";
import path from "path";

export const loadModels = async () => {
  const modelPath = path.join(process.cwd(), "src/face-models");

  await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

  console.log("Face models loaded");
};
