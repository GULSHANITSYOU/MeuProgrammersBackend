import { Router } from "express";
import { handelResetPasswordRequest } from "../controllers/password.reset.req.js";
import { handelResetnewPassword } from "../controllers/newPassword.reset.js";
const studentRoute = Router();

// reset password requist api
studentRoute.route("/reset/request").post(handelResetPasswordRequest);

// reset password api
studentRoute.route("/reset/newpassword/:token").patch(handelResetnewPassword);

export default studentRoute;
