import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

export const createUser = async (req, res) => {
  try {
    const { name, age, bio } = req.body;

    if (!name || !age) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.create({
      name,
      age,
      bio,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
