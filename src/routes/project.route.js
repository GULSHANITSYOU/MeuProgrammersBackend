import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middelware.js";
import {
  handelProjectAdd,
  handelProjectUpdate,
} from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middelware.js";

const projectRoute = Router();

// update project api
projectRoute
  .route("/addNewProject")
  .post(verifyToken, upload.array("projectImages"), handelProjectAdd);

// update project api
projectRoute
  .route("/update/project/:projectId")
  .patch(verifyToken, upload.array("projectImages"), handelProjectUpdate);

export default projectRoute;
