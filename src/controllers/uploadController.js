import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const uploadProfileImages = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.files?.profile || !req.files?.verification) {
      return res.status(400).json({ error: "Both images required" });
    }

    const profileFile = req.files.profile[0];
    const verificationFile = req.files.verification[0];

    const profileUpload = await cloudinary.uploader.upload(
      `data:${profileFile.mimetype};base64,${profileFile.buffer.toString("base64")}`,
    );

    const verificationUpload = await cloudinary.uploader.upload(
      `data:${verificationFile.mimetype};base64,${verificationFile.buffer.toString("base64")}`,
    );

    const user = await User.findById(userId);

    user.profilePic = profileUpload.secure_url;
    user.verificationImage = verificationUpload.secure_url;

    await user.save();

    res.json({
      message: "Images uploaded successfully",
      profileImage: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
