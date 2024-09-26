import { asyncHandler } from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { Student } from "../models/student.model.js";
import jwt from "jsonwebtoken";
import { GenerateAccessAndRefreshToken } from "../controllers/student.register.controller.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // Extract the access token from headers or cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) throw new apiError("failed", 401, "Access token required");

    // Verify the access token
    const { _id, studentId, email } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // Find the student by _id, excluding sensitive data
    const student = await Student.findById(_id).select("-password -refreshToken");

    if (!student) throw new apiError("failed", 401, "Unauthorized access");

    // Attach the student to the request object
    req.student = student;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Call the refresh token handler if the access token has expired
      await verifyRefreshToken(req, res, next);
    } else {
      // Handle other token-related errors
      throw new apiError("failed", 401, error.message);
    }
  }
});

// Function to handle refresh token verification
async function verifyRefreshToken(req, res, next) {
  try {
    // Extract the refresh token from cookies or headers
    const refreshToken =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[2];

    if (!refreshToken) throw new apiError("failed", 401, "Refresh token required");

    // Verify the refresh token
    const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the student by _id, excluding sensitive data
    const student = await Student.findById(_id).select("-password -refreshToken");

    if (!student) throw new apiError("failed", 401, "Unauthorized access");

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await GenerateAccessAndRefreshToken(_id);

    // Set new tokens in cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
      sameSite: "Strict", // Protect against CSRF
    };

    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions);

    // Attach the student to the request object
    req.student = student;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle errors during refresh token verification
    throw new apiError("failed", 401, "Invalid or expired refresh token");
  }
}
