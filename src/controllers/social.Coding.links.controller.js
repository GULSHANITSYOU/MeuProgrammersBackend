import { asyncHandler } from "../utils/async.handler.js";
import { SocialProfile } from "../models/socialprofile.model.js";
import { apiResponse } from "../utils/api.response.js";
import { apiError } from "../utils/api.error.js";

async function updateprofilelinks(req, res) {
  const student = req.student;

  const { linkedin, github, twitterX, instagram } = req.body;

  const socialProfileLinks = await SocialProfile.findByIdAndUpdate(
    student.SocialProfile,
    { linkedin, github, twitterX, instagram },
    { runValidators: true, new: true }
  );

  if (!socialProfileLinks) {
    throw new apiError("fail", 500, "can not update social links");
  }
  return res
    .status(200)
    .json(
      new apiResponse(
        "success",
        201,
        socialProfileLinks,
        "Links added Successfully"
      )
    );
}

const handelSocialCodingLinks = asyncHandler(async (req, res) => {
  const student = req.student;

  const { linkedin, github, twitterX, instagram } = req.body;

  if (student.SocialProfile) {
    return await updateprofilelinks(res, res);
  }

  const newsociallinks = new SocialProfile({
    studentId: student._id,
    linkedin: linkedin || "",
    github: github || "",
    twitterX: twitterX || "",
    instagram: instagram || "",
  });
  const socialslinks = await newsociallinks.save();
  student.SocialProfile = newsociallinks._id;
  await student.save();

  return res
    .status(201)
    .json(
      new apiResponse("success", 201, socialslinks, "Links added Successfully")
    );
});

export { handelSocialCodingLinks };
