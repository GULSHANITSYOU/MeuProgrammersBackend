import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middelware.js";
import { handelSocialCodingLinks } from "../controllers/social.Coding.links.controller.js";

const socialCodingLinksRoute = Router();

socialCodingLinksRoute
  .route("/add/social-Links")
  .post(verifyToken, handelSocialCodingLinks);

export default socialCodingLinksRoute;
