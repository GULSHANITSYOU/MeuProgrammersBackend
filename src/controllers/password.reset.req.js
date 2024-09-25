import { asyncHandler } from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { Student } from "../models/student.model.js";
import { apiResponse } from "../utils/api.response.js";
import { sendMail } from "../utils/email.service.js";
import jwt from "jsonwebtoken";

const handelResetPasswordRequest = asyncHandler(async (req, res) => {
  const { email, mobile, studentId } = req.body;

  if (!(email || mobile || studentId)) {
    throw new apiError(
      "fail",
      401,
      "At least one of email, mobile, or studentId is required"
    );
  }

  // Check if student exists
  const student = await Student.findOne({
    $or: [{ email }, { mobile }, { studentId }],
  });

  if (!student) {
    throw new apiError("fail", 404, "Student not found");
  }

  // Generate password reset token
  const passwordResetToken = jwt.sign(
    {
      _id: student._id,
      email: student.email,
      studentId: student.studentId,
      mobile: student.mobile,
    },
    process.env.PASSWORD_RESET_TOKEN_SECRET,
    {
      expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY || "15m", // Default to 15 minutes if not set
    }
  );

  // Generate reset link (use dynamic URL)
  const resetLink = `${process.env.CLIENT_URL}/password/reset/newpassword/${passwordResetToken}`;

  // Send email with reset link
  const emailSent = await sendMail(
    student.email,
    "Password Reset Request",
    `Hello ${student.firstName},

We received a request to reset your password. To proceed, please click the link below:
Reset Password Link: ${resetLink}

This link will expire in ${process.env.PASSWORD_RESET_TOKEN_EXPIRY || 15} minutes.
If you did not request this, please ignore this email. For any concerns, feel free to contact support.

Best regards,
Your Team`
  );

  if (!emailSent) {
    throw new apiError("fail", 500, "Failed to send reset password email.");
  }

  // Send success response
  return res
    .status(201)
    .json(new apiResponse("success", 201, emailSent, "Mail sent successfully"));
});

export { handelResetPasswordRequest };
