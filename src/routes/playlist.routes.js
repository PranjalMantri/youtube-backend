import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

// secure routes

router.route("/").post(createPlaylist);
router.route("/:userId").get(getUserPlaylist);
router.route("/p/:playlistId").get(getPlaylistById);

export default router;
