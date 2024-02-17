import { isValidObjectId } from "mongoose";
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

  // Finding user from refreshToken in cookies
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  const tweet = await Tweet.create({
    owner: user._id,
    content,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfuly"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user");
  }

  // Checking whether use exists or not
  const user = await User.findById({
    _id: userId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({
    owner: userId,
  });

  if (!tweets) {
    throw new ApiError(404, "User has no tweets");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfTweets: tweets.length,
        tweets,
      },
      "Fetched user tweets successfully"
    )
  );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(404, "Tweet does not exist");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
    },
    {
      $set: {
        content: content,
      },
    },
    {
      new: true,
    }
  );

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while updating the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfuly"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweeet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
