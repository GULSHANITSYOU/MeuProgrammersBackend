import { Router } from "express";
import {
  handelPersonalDetailsUpdate,
  handelProfileImageUpdate,
  hadelUpdatingSkills,
  handleNewExperienceadd,
  handleUpdateExperience,
} from "../controllers/profile.updates.controller.js";
import { verifyToken } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middelware.js";
const profileRoute = Router();

// update profile api
profileRoute
  .route("/update/personal-details")
  .patch(verifyToken, handelPersonalDetailsUpdate);

// update profile image
profileRoute
  .route("/update/profile-image")
  .patch(verifyToken, upload.single("profileImage"), handelProfileImageUpdate);

// adding skills
profileRoute.route("/update/skills").patch(verifyToken, hadelUpdatingSkills);

// adding Experience //
profileRoute
  .route("/add/new-Experience")
  .post(verifyToken, handleNewExperienceadd);

// update experience api
profileRoute
  .route("/update/experience/:experienceId")
  .patch(verifyToken, handleUpdateExperience);

export default profileRoute;
