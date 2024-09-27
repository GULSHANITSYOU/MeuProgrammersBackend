import { asyncHandler } from "../utils/async.handler.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { Resource } from "../models/resource.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const handelResourcesAdd = asyncHandler(async (req, res) => {
  // Logged-in student
  const student = req.student;

  // Preview images
  const images = req.files;

  // Resource data
  const {
    courseName,
    year,
    sem,
    subjectName,
    resourceType,
    aboutResource,
    resourceLink,
  } = req.body;

  // Validation
  if (
    !courseName ||
    !year ||
    !sem ||
    !subjectName ||
    !resourceType ||
    !aboutResource ||
    !resourceLink
  ) {
    throw new apiError("fail", 400, "All fields are required");
  }

  // Upload all images on Cloudinary
  const uploadedImages = [];
  try {
    for (let i = 0; i < images.length; i++) {
      const uploadResult = await uploadOnCloudinary(images[i].path);
      uploadedImages.push(uploadResult.url); // Store only the URL of the uploaded image
    }
  } catch (error) {
    throw new apiError("fail", 500, "Error uploading images");
  }

  // Create a new Resource entry
  const newResource = await Resource.create({
    owner: student._id,
    courseName,
    year,
    sem,
    subjectName,
    resourceType,
    aboutResource,
    previewImages: uploadedImages,
    resourceLink,
  });

  // Update student resources
  student.resourcesIds.push(newResource._id);

  // Save student in DB
  await student.save({ validateBeforeSave: false });

  // Response to the client with relevant data
  return res.status(201).json(
    new apiResponse(
      "success",
      201,
      {
        _id: newResource._id,
        courseName: newResource.courseName,
        subjectName: newResource.subjectName,
        resourceType: newResource.resourceType,
        aboutResource: newResource.aboutResource,
        resourceLink: newResource.resourceLink,
        previewImages: newResource.previewImages, // URL of the uploaded images
      },
      "Your resource was added successfully"
    )
  );
});

export { handelResourcesAdd };
