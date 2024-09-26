import { Router } from "express";
import { handelPersonalDetailsUpdate } from "../controllers/profile.updates.controller.js";
import { verifyToken } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middelware.js";
const profileRoute = Router();

// update profile api
profileRoute
  .route("/update/personal-details")
  .patch(
    verifyToken,
    upload.single("profileImage"),
    handelPersonalDetailsUpdate
  );

export default profileRoute;
