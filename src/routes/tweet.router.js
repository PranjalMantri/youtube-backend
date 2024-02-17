import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet } from "../controllers/tweet.subscription.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createTweet);
export default router;
