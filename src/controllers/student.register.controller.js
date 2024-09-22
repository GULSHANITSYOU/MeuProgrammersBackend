import { asyncHandler } from "../utils/async.handler.js";
import { Student } from "../models/student.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";

export const GenerateAccessAndRefreshToken = async (studentId) => {
  try {
    const student = await Student.findById(studentId);

    if (!student) throw new apiError("faild", 401, "Student not found");

    const refreshToken = student.generateRefreshToken();
    const accessToken = student.generateAccessToken();

    student.refreshToken = refreshToken;

    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      "faild",
      401,
      error.message ||
        "Something went wrong while generating access and refresh token"
    );
  }
};

const handelStudentRegistration = asyncHandler(async (req, res) => {
  /// Get data from req.body
  let { firstName, lastName, studentId, email, mobile, password } = req.body;

  // Check for missing required fields
  if ([firstName, studentId, email, password].some((field) => !field)) {
    throw new apiError("faild", 401, "Missing required fields");
  }

  // Validate if the user exists based on email or studentId
  const student = await Student.findOne({
    $or: [{ email }, { studentId }],
  });

  if (student) throw new apiError("faild", 401, "User already exists");

  // Convert studentId and mobile to numbers
  studentId = Number(studentId);
  if (mobile) mobile = Number(mobile);

  // Validate password
  if (password.trim() === "") {
    throw new apiError("faild", 401, "Password cannot be empty");
  }

  // Validate email and convert to lowercase
  if (email.trim() === "") {
    throw new apiError("faild", 401, "Email cannot be empty");
  }
  email = email.toLowerCase();

  // Create new student
  const newStudent = await Student.create({
    firstName,
    lastName: lastName || "",
    studentId,
    email,
    mobile: mobile || 0,
    password,
  });

  const { accessToken, refreshToken } = await GenerateAccessAndRefreshToken(
    newStudent._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  newStudent.password =
    newStudent.skills =
    newStudent.projectIds =
    newStudent.experienceIds =
    newStudent.clubIds =
    newStudent.resourcesIds =
      undefined;

  // Send success response
  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new apiResponse("success", 201, newStudent, "User created successfully")
    );
});

export { handelStudentRegistration };
