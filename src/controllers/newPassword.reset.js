import { asyncHandler } from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { Student } from "../models/student.model.js";
import jwt from "jsonwebtoken";

const handelResetnewPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    throw new apiError("fail", 401, "Passwords do not match");

  if (!token) {
    throw new apiError("fail", 401, "Token is required");
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET);

  if (!decoded) {
    throw new apiError("fail", 401, "Invalid token");
  }

  const { _id, mobile, email, studentId } = decoded;

  // Find the student by _id
  const student = await Student.findById(_id);

  if (!student) {
    throw new apiError("fail", 404, "Student not found");
  }

  // Set new password
  student.password = password;
  await student.save();

  const { firstName, lastName } = student;
  // Send success response
  return res
    .status(200)
    .json(
      new apiResponse(
        "success",
        200,
        { firstName, lastName, email, mobile, studentId, password },
        "Password reset successfully"
      )
    );
});

export { handelResetnewPassword };
