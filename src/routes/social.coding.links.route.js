import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middelware.js";
import {
  handelSocialLinks,
  handelCodingLinks,
} from "../controllers/social.Coding.links.controller.js";

const socialCodingLinksRoute = Router();

// route for changing or updating social profile links
socialCodingLinksRoute
  .route("/add/social-Links")
  .post(verifyToken, handelSocialLinks);

// route for changing or updating  coding profile links
socialCodingLinksRoute
  .route("/add/Coding-Links")
  .post(verifyToken, handelCodingLinks);

export default socialCodingLinksRoute;
