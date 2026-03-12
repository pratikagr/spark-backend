import * as faceapi from "face-api.js";
import canvas from "canvas";
import fetch from "node-fetch";
// import axios from "axios";
import User from "../models/User.js";

const { loadImage } = canvas;

async function loadRemoteImage(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return loadImage(Buffer.from(buffer));
}

export const verifyFace = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user.profilePic || !user.verificationImage) {
      return res.status(400).json({ error: "Images missing" });
    }

    const profileImg = await loadRemoteImage(user.profilePic);
    const verifyImg = await loadRemoteImage(user.verificationImage);

    const profileDetection = await faceapi
      .detectSingleFace(profileImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const verifyDetection = await faceapi
      .detectSingleFace(verifyImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!profileDetection || !verifyDetection) {
      return res.json({ message: "Face not detected" });
    }

    const distance = faceapi.euclideanDistance(
      profileDetection.descriptor,
      verifyDetection.descriptor,
    );

    const match = distance < 0.6;

    if (match) {
      user.isVerified = true;
      await user.save();
    }

    res.json({
      match,
      distance,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
