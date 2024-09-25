import { Router } from "express";
import { handelResetPasswordRequest } from "../controllers/password.reset.req.js";
const studentRoute = Router();

// reset password requist api
studentRoute.route("/reset/request").post(handelResetPasswordRequest);


export default studentRoute;
