import { Router } from "express";
import {
  getAllVideos,
  publishVideo,
  updateVideoDetails,
  updateVideo,
  updateThumbnail,
  deleteVideo,
  getVideoById,
  togglePublishStatus,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);
// secure routes
router.route("/get-videos").get(getAllVideos);
router.route("/upload").post(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  publishVideo
);
router.route("/get-video/:videoId").get(getVideoById);
router.route("/update-video-details/:videoId").patch(updateVideoDetails);

router
  .route("/update-video/:videoId")
  .patch(upload.single("video"), updateVideo);

router
  .route("/update-thumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateThumbnail);

router.route("/delete/:videoId").get(deleteVideo);

router.route("/toggle-publish-status/:videoId").patch(togglePublishStatus);
export default router;
