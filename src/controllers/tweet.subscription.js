import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(404, "Content is required");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  const tweet = await Tweet.create({
    owner: user._id,
    content,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfuly"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  //TODO: Get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update a existing tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweeet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
