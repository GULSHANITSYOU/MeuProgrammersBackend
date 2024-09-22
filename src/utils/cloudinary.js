import { v2 as cloudinary } from "cloudinary";
import { log } from "node:console";
import fs from "node:fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async function (localFilePath) {
  try {
    // if there is no local path
    if (!localFilePath) return null;

    // upload and get responce
    const responce = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlink(localFilePath, (err) => {
      log(err);
    });

    // get url from responce.url
    return responce;
  } catch (error) {
    fs.unlink(localFilePath, (err) => {
      log(err);
    });
    return error || "error while uploading on cloudinary";
  }
};
