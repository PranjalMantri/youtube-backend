import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

// secure routes

router.route("/:videoId").post(addComment);

export default router;
