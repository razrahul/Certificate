import userService from "../services/userService.js";
import { sendSuccessResponse, sendErrorResponse } from "../utils/response.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const healthCheack = (req, res) => {
  sendSuccessResponse(res, "Server are healthy and running");
};

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, phone, department, role, office } = req.body;

    if (!name || !email || !password) {
      return sendErrorResponse(res, "Name, email and password are required", {}, 400);
    }

    // Check if email or username already exists
    const existingUsers = await userService.findUsersByEmailOrUsername(email, username);

    if (existingUsers && existingUsers.length > 0) {
      let isEmailDup = false;
      let isUsernameDup = false;

      for (const u of existingUsers) {
        if (u.email === email) isEmailDup = true;
        if (username && u.username === username) isUsernameDup = true;
        if (isEmailDup && isUsernameDup) break;
      }

      if (isEmailDup && isUsernameDup) {
        return sendErrorResponse(res, "Email and Username already exist", {}, 400);
      }
      if (isEmailDup) {
        return sendErrorResponse(res, "Email already exists", {}, 400);
      }
      if (isUsernameDup) {
        return sendErrorResponse(res, "Username already exists", {}, 400);
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await userService.createUserForMysql({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      department,
      role,
      office,
    });

    const userData = user.toJSON();
    delete userData.password;

    sendSuccessResponse(res, "User created successfully", userData, 201);
  } catch (error) {
    sendErrorResponse(res, "Error creating user", error.message, 500);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return sendErrorResponse(res, "Username/email and password are required", {}, 400);
    }

    const user = await userService.findUserForMysql(loginIdentifier);

    if (!user) {
      return sendErrorResponse(res, "User not found", {}, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendErrorResponse(res, "Invalid credentials", {}, 401);
    }

    const userData = user.toJSON();
    delete userData.password;

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET || "super_secret_jwt_key_development_987654321",
      { expiresIn: process.env.JWT_EXPIRE || "24h" }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Blocks XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // Protects against CSRF
      maxAge: Number(process.env.JWT_COOKIE_EXPIRE) || 24 * 60 * 60 * 1000, // Fallback to 24 hours
    };

    res.cookie("token", token, cookieOptions);

    sendSuccessResponse(res, "Login successful", { token, user: userData }, 200);
  } catch (error) {
    sendErrorResponse(res, "Error logging in user", error.message, 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    const user = req.user; // Set by verifyToken middleware

    
    if(oldPassword === newPassword){
      return sendErrorResponse(res, "New password must be different from old password", {}, 400);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return sendErrorResponse(res, "Invalid old password", {}, 401);
    }


    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.tokenVersion += 1;
    await user.save();

    sendSuccessResponse(res, "Password changed successfully", {}, 200);
  } catch (error) {
    sendErrorResponse(res, "Error changing password", error.message, 500);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    user.tokenVersion += 1;
    await user.save();

    // Clear the HTTP-Only token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    sendSuccessResponse(res, "Logout successful");
  } catch (error) {
    sendErrorResponse(res, "Error logging out", error.message, 500);
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { email, newRole } = req.body;

    const user = await userService.findUserForMysql(email);
    if (!user) {
      return sendErrorResponse(res, "User not found", {}, 404);
    }

    user.role = newRole;
    user.tokenVersion += 1; // Invalidate current session/tokens for that user due to role change
    await user.save();

    const userData = user.toJSON();
    delete userData.password;

    sendSuccessResponse(res, "User role updated successfully", userData, 200);
  } catch (error) {
    sendErrorResponse(res, "Error updating user role", error.message, 500);
  }
};

export const adminResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userService.findUserForMysql(email);
    if (!user) {
      return sendErrorResponse(res, "User not found", {}, 404);
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    user.tokenVersion += 1; // Force log out that user from all devices since password was reset
    await user.save();

    sendSuccessResponse(res, "User password reset successfully", {}, 200);
  } catch (error) {
    sendErrorResponse(res, "Error resetting user password", error.message, 500);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userData = req.user.toJSON();
    delete userData.password; // Hide password hash
    
    sendSuccessResponse(res, "User profile fetched successfully", userData, 200);
  } catch (error) {
    sendErrorResponse(res, "Error fetching user profile", error.message, 500);
  }
};
