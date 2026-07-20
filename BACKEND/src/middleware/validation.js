import { z } from "zod";
import { sendErrorResponse } from "../utils/response.js";

// Validation schema for registering a user
export const registerUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .optional()
      .or(z.literal("")), // allows optional empty string
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    phone: z.string().optional(),
    department: z.string().optional(),
    role: z.enum(["SUPERADMIN", "ADMIN","OPERATOR", "USER"]).default("USER").optional(),
    office: z.enum(["patna_office", "purnia_office"]).optional(),
  }),
});

// Validation schema for logging in a user
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").optional(),
    username: z.string().optional(),
    password: z.string({ required_error: "Password is required" }),
  }).refine((data) => data.email || data.username, {
    message: "At least one of email or username is required to login",
    path: ["email"],
  }),
});

// Validation schema for changing password
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z.string({ required_error: "New password is required" }).min(6, "New password must be at least 6 characters long"),
  }).refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  }),
});

// Validation schema for updating user role (SUPERADMIN only)
export const updateUserRoleSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Target email is required" }).email("Invalid email format"),
    newRole: z.enum(["SUPERADMIN", "ADMIN", "OPERATOR", "USER"], {
      required_error: "New role is required",
    }),
  }),
});

// Validation schema for resetting user password (SUPERADMIN only)
export const adminResetPasswordSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Target email is required" }).email("Invalid email format"),
    newPassword: z.string({ required_error: "New password is required" }).min(6, "New password must be at least 6 characters long"),
  }),
});

/**
 * Generic validation middleware to parse requests against a Zod schema.
 * @param {z.ZodObject} schema The Zod schema to validate against
 */
export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Map validation errors to list of { field, message }
      const issues = error.issues || [];
      const errorDetails = issues.map((err) => ({
        field: err.path.slice(1).join("."), // removes 'body' prefix, e.g., 'body.email' -> 'email'
        message: err.message,
      }));
      return sendErrorResponse(res, "Validation failed", errorDetails, 400);
    }
    return sendErrorResponse(res, "Server validation error", error.message, 500);
  }
};
