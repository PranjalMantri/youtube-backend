import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  //TODO: get total videos, total video views, total likes, total subsrcibers

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        subscriber: user._id,
      },
    },
    {
      $count: "subscribers",
    },
  ]);

  const videos = await Video.aggregate([
    {
      $match: {
        owner: user._id,
      },
    },
    {
      $count: "videos",
    },
  ]);

  const likes = await Like.aggregate([
    {
      $match: {
        likedBy: user._id,
      },
    },
    {
      $count: "likes",
    },
  ]);

  const views = await Video.aggregate([
    {
      $match: {
        owner: user._id,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: {
          $sum: "$views",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalViews: 1,
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the number of subsrcibers"
    );
  }

  if (!videos) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the number of videos"
    );
  }

  if (!likes) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the number of likes"
    );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        subscribers: subscribers[0].subscribers,
        videos: videos[0].videos,
        likes: likes[0].likes,
        totalViews: views[0].totalViews,
      },
      "Successfuly fetched the channel statistics"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  //TODO: get all of the channel's videos
});

export { getChannelStats, getChannelVideos };
