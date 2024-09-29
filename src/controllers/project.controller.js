import { asyncHandler } from "../utils/async.handler.js";
import { apiResponse } from "../utils/api.response.js";
import { Project } from "../models/project.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiError } from "../utils/api.error.js";

const handelProjectAdd = asyncHandler(async (req, res) => {
  const student = req.student;
  const projectImages = req.files;
  const { projecctTitle, projectDescription, projectVisitUrl, githubUrl } =
    req.body;
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

const handelProjectUpdate = asyncHandler(async (req, res) => {
  const projectImages = req.files;
  const projectId = req.params.projectId;
  console.log(projectId);

  const { projecctTitle, projectDescription, projectVisitUrl, githubUrl } =
    req.body;

  // Validation
  if (!projecctTitle || !projectDescription) {
    throw new apiError(
      "fail",
      400,
      "Project title and description are required"
    );
  }

  // Initialize an empty array for uploaded images
  let uploadedImages = [];

  // Upload images only if they are provided
  if (projectImages && projectImages.length > 0) {
    try {
      for (let i = 0; i < projectImages.length; i++) {
        const uploadResult = await uploadOnCloudinary(projectImages[i].path);
        uploadedImages.push(uploadResult.url); // Store only the URL of the uploaded image
      }
    } catch (error) {
      throw new apiError("fail", 500, "Error uploading images");
    }
  }

  // Build the update object conditionally
  const updateData = {
    projecctTitle,
    projectDescription,
    projectVisitUrl,
    githubUrl,
  };

  // Conditionally add media if new images were uploaded
  if (uploadedImages.length > 0) {
    updateData.media = uploadedImages;
  }

  // Update the project in the database
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    updateData,
    {
      new: true, // Return the updated project after the update
    }
  );

  // Handle any potential errors
  if (!updatedProject) {
    throw new apiError("fail", 500, "Failed to update project");
  }

  // Return a success response with updated project details
  return res
    .status(200)
    .json(
      new apiResponse(
        "success",
        200,
        updatedProject,
        "Project updated successfully"
      )
    );
});

export { handelProjectAdd, handelProjectUpdate };
