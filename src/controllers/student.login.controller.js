import { asyncHandler } from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { Student } from "../models/student.model.js";
import { apiResponse } from "../utils/api.response.js";
import { GenerateAccessAndRefreshToken } from "./student.register.controller.js";

export const handelStudentLogin = asyncHandler(async (req, res) => {
  const { email, password, mobile, studentId } = req.body;

  if (!(email || mobile || studentId)) {
    throw new apiError(
      "fail",
      401,
      "At least one of email, mobile, or studentId is required"
    );
  }

  if (!password) {
    throw new apiError("fail", 401, "Password is required");
  }

  const student = await Student.findOne({
    $or: [{ email }, { mobile }, { studentId }],
  });

  if (!student) {
    throw new apiError("fail", 401, "Student not found");
  }

  const isPasswordCorrect = await student.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new apiError("fail", 401, "Password is incorrect");
  }

  // Generate Access and Refresh tokens
  const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(
    student._id
  );

  // Set httpOnly and secure options for cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure it's only secure in production
    sameSite: "strict", // Helps protect from CSRF
  };

  // Hide sensitive fields from the response
  student.password = undefined;
  student.skills = undefined;
  student.projectIds = undefined;
  student.experienceIds = undefined;
  student.clubIds = undefined;
  student.resourcesIds = undefined;

  // Return response with cookies and student data
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new apiResponse("success", 200, student, "Login successful"));
});
