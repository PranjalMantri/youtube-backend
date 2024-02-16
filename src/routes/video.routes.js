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

router
  .route("/")
  .get(getAllVideos)
  .post(
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

router
  .route("/:videoId")
  .get(getVideoById)
  .patch(updateVideoDetails)
  .delete(deleteVideo);

router
  .route("/update-video/:videoId")
  .patch(upload.single("video"), updateVideo);

router
  .route("/update-thumbnail/:videoId")
  .patch(upload.single("thumbnail"), updateThumbnail);

router.route("/toggle-publish-status/:videoId").patch(togglePublishStatus);
export default router;
