import { asyncHandler } from "../utils/async.handler.js";
import { apiResponse } from "../utils/api.response.js";
import { apiError } from "../utils/api.error.js";

const handelPersonalDetailsUpdate = asyncHandler(async (req, res) => {
  const student = req.student;

  const { firstName, lastName, about, headingLine } = req.body;

  // Assign only the provided fields to the student object
  if (firstName) student.firstName = firstName;
  if (lastName) student.lastName = lastName;
  if (about) student.about = about;
  if (headingLine) student.headingLine = headingLine;

  // Save the updated student record
  const updatedStudent = await student.save();

  // Handle any potential errors during the save process
  if (!updatedStudent) {
    throw new apiError("fail", 500, "Failed to update the student's details");
  }

  // Return a success response with updated details
  return res.status(200).json(
    new apiResponse(
      "success",
      200,
      {
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        about: updatedStudent.about,
        headingLine: updatedStudent.headingLine,
      },
      "Profile updated successfully"
    )
  );
});

export { handelPersonalDetailsUpdate };
