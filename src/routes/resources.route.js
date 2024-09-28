import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middelware.js";
import { upload } from "../middlewares/multer.middelware.js";
import {
  handelResourcesAdd,
  handelGetResources,
} from "../controllers/resources.controller.js";

const resourceRoute = Router();

resourceRoute
  .route("/upload/new/resource")
  .post(verifyToken, upload.array("prieviewImages"), handelResourcesAdd);

resourceRoute.route("/get/resource").get(handelGetResources);

export default resourceRoute;
