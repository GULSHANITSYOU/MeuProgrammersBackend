import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middelware.js";
import { handelResourcesAdd } from "../controllers/resources.controller.js";

const resourceRoute = Router();

resourceRoute
  .route("/upload/new/resource")
  .post(verifyToken, upload.array("prieviewImages"), handelResourcesAdd);

export default resourceRoute;
