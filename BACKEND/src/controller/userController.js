import User from "../model/user.js";
import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const healthCheack = (req, res) => {
  res.status(200).json({ message: "Server are healthy and running" });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      role,
    });

    await user.save();

    user.password = undefined;

    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, username, loginId, password } = req.body;
    const loginIdentifier = email || username || loginId;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        message: "Username/email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { name: loginIdentifier }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in user",
      error: error.message,
    });
  }
};
