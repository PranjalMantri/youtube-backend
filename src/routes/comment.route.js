import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJWT);

// secure routes

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:commentId").patch(updateComment).delete(deleteComment);

export default router;
