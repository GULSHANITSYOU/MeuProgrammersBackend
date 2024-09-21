/**
 * This file contains middleware function for authentication
 * 1. verifyToken - verifies the access token and sets the student in the request
 * @module middleware/auth.middleware
 */

import asyncHandler from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { Student } from "../models/student.model.js"; // Missing .js in the original code
import jwt from "jsonwebtoken";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Safely extracting token from headers or cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) throw new apiError(401, "Unauthorized");

    // Verify token and extract payload
    const { _id, studentId, email } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Find the student by _id, excluding sensitive data
    const student = await Student.findById(_id).select(
      "-password -refreshToken"
    );

    if (!student) throw new apiError(401, "Unauthorized - Student not found");

    // Attach the student to the request object for further usage
    req.student = student;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle expired token
    if (error.name === "TokenExpiredError") {
      throw new apiError(401, "Token expired, please log in again");
    }

    // Handle other token-related errors
    throw new apiError(401, error.message || "Unauthorized");
  }
});
