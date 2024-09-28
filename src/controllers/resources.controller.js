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

// find the resource

const handelGetResources = asyncHandler(async (req, res) => {
  let { courseName, year, sem, subjectName, resourceType } = req.body;

  // Validate the required fields
  if (!courseName || !year || !sem || !subjectName || !resourceType) {
    throw new apiError("fail", 400, "All fields are required");
  }

  year = Number(year);
  sem = Number(sem);

  // Perform aggregation to search for matching resources
  const searchResult = await Resource.aggregate([
    {
      $match: {
        courseName,
        year,
        sem,
        subjectName,
        resourceType,
      },
    },
    {
      $lookup: {
        from: "students",
        localField: "owner",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $project: {
        _id: 1,
        courseName: 1,
        year: 1,
        sem: 1,
        subjectName: 1,
        resourceType: 1,
        aboutResource: 1,
        resourceLink: 1,
        previewImages: 1,
        owner: 1,
        student: {
          _id: 1,
          firstName: 1, // Corrected typo from "fistName" to "firstName"
          lastName: 1,
          profileImage: 1,
        },
      },
    },
  ]);

  // Check if no resources were found
  if (searchResult.length === 0) {
    throw new apiError("fail", 404, "No resources found matching the criteria");
  }

  // Return the found resources
  return res
    .status(200)
    .json(
      new apiResponse(
        "success",
        200,
        searchResult,
        "Resources fetched successfully"
      )
    );
});

export { handelResourcesAdd, handelGetResources };
