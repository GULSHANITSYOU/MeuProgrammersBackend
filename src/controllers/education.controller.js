import { asyncHandler } from "../utils/async.handler.js";
import { apiResponse } from "../utils/api.response.js";
import { Education } from "../models/education.model.js";

const handelEducationAdd = asyncHandler(async (req, res) => {
  const student = req.student;
  const { courseName, branch, startDate, endDate } = req.body;

  // Create a new Education entry
  const newEducation = new Education({
    studentId: student._id,
    courseName,
    branch,
    startDate,
    endDate,
  });

  // Save the new education
  const savedEducation = await newEducation.save();

  if (!savedEducation) {
    return res
      .status(500)
      .json(new apiResponse("fail", 500, null, "Failed to add new education"));
  }

  // Add the new education to the student
  student.education = savedEducation._id;
  await student.save();

  // Return successful response with the newly added education details
  return res
    .status(201)
    .json(
      new apiResponse(
        "success",
        201,
        savedEducation,
        "Education added successfully"
      )
    );
});

export { handelEducationAdd };
