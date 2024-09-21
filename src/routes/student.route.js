import { Router } from "express";
import { handelStudentRegistration } from "../controllers/student.register.controller.js";

const studentRoute = Router();

// register student api
studentRoute.route("/register").post(handelStudentRegistration);

export default studentRoute;
