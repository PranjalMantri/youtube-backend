import { asyncHandler } from "../utils/asyncHandler";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: Create a tweet
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
