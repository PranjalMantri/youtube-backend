import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getChannelSubscribers,
  getSusbcribedChannels,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/:channelId").get(getChannelSubscribers).post(toggleSubscription);
router.route("/:subsrciberId").get(getSusbcribedChannels);

export default router;
