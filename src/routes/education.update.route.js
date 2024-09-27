import route from "express";
import { handelEducationAdd } from "../controllers/education.controller.js";
import { verifyToken } from "../middlewares/auth.middelware.js";
const educationRoute = route.Router();

// update education api
educationRoute.route("/addNewEducation").post(verifyToken, handelEducationAdd);

export default educationRoute;
