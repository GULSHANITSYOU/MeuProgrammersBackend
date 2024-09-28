import { asyncHandler } from "../utils/async.handler.js";
import { apiResponse } from "../utils/api.response.js";
import { Project } from "../models/project.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const handelProjectAdd = asyncHandler(async (req, res) => {
  const student = req.student;
  const projectImages = req.files;
  const {
    projecctTitle,
    projectDescription,
    projectVisitUrl,
    githubUrl,
  } = req.body;
  if (!projecctTitle || !projectDescription) {
    throw new apiError(
      "fail",
      400,
      "Project title and description is required"
    );
  }

  // Upload all images on Cloudinary
  const uploadedImages = [];
  try {
    for (let i = 0; i < projectImages.length; i++) {
      const uploadResult = await uploadOnCloudinary(projectImages[i].path);
      uploadedImages.push(uploadResult.url); // Store only the URL of the uploaded image
    }
  } catch (error) {
    throw new apiError("fail", 500, "Error uploading images");
  }

  const newProject = new Project({
    studentId: student._id,
    projecctTitle,
    projectDescription,
    projectVisitUrl,
    githubUrl,
    media: uploadedImages,
  });
  const savedProject = await newProject.save();

  if (!savedProject) {
    return res
      .status(500)
      .json(new apiResponse("fail", 500, null, "Failed to add new project"));
  }

  // Add the new project to the student
  student.projectIds.push(savedProject._id);
  await student.save();

  return res
    .status(201)
    .json(
      new apiResponse(
        "success",
        201,
        savedProject,
        "Project added successfully"
      )
    );
});

export { handelProjectAdd };
