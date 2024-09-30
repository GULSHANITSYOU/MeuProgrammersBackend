import route from "express";
import {
  handelEducationAdd,
  handelEducationUpdate,
} from "../controllers/education.controller.js";
import { verifyToken } from "../middlewares/auth.middelware.js";
const educationRoute = route.Router();

// add new education api
educationRoute.route("/addNewEducation").post(verifyToken, handelEducationAdd);

// update education api
educationRoute
  .route("/update/education/:educationId")
  .patch(verifyToken, handelEducationUpdate);

export default educationRoute;
