import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

// secure routes

router.route("/").post(createPlaylist);
router.route("/:userId").get(getUserPlaylist);
router.route("/p/:playlistId").get(getPlaylistById);
router
  .route("/add/:playlistId/:videoId")
  .post(addVideoToPlaylist)
  .delete(removeVideoFromPlaylist);

export default router;
