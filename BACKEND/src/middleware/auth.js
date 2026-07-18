import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/response.js";
import userService from "../services/userService.js";

/**
 * Authentication middleware to verify JWT token.
 */
export const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // 1. Try to read token from cookies (HTTP-Only)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Fallback to Authorization Header (Bearer Token)
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendErrorResponse(res, "Access denied. Authentication token is missing.", {}, 401);
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_jwt_key_development_987654321"
    );

    // Retrieve user from database using username from token
    const user = await userService.findUserForMysql(decoded.username);
    if (!user) {
      return sendErrorResponse(res, "Access denied. User not found.", {}, 401);
    }

    // Check if token session version matches user's database version
    if (decoded.tokenVersion !== user.tokenVersion) {
      return sendErrorResponse(res, "Session expired or logged out. Please login again.", {}, 401);
    }

    // Attach user instance to request
    req.user = user;
    next();
  } catch (error) {
    return sendErrorResponse(res, "Invalid or expired token.", error.message, 401);
  }
};

/**
 * Middleware to restrict access based on user roles.
 * @param {...String} allowedRoles Roles allowed to access the route
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendErrorResponse(
        res,
        "Access denied. You do not have the required permissions.",
        {},
        403
      );
    }
    next();
  };
};
