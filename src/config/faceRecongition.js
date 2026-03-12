import * as faceapi from "face-api.js";
import canvas from "canvas";

const { Canvas, Image, ImageData } = canvas;

faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export const loadModels = async () => {
  const modelPath = "./src/face-models";

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);

  console.log("Face models loaded (SSD Mobilenet)");
};
