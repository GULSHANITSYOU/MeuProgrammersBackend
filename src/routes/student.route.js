import { Router } from "express";
import { handelStudentRegistration } from "../controllers/student.register.controller.js";
import { handelStudentLogin } from "../controllers/student.login.controller.js";
const studentRoute = Router();

// register student api
studentRoute.route("/register").post(handelStudentRegistration);
// login student api
studentRoute.route("/login").post(handelStudentLogin);

export default studentRoute;
