import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "Channel does not exist");
  }

  // if channel exists then it is already a user

  const channel = await User.findById({
    _id: channelId,
  });

  if (!channel) {
    throw new ApiError(400, "Channel does not exist");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  let subscribe, unsubscribe;

  const userIsSubscribed = await Subscription.findOne({
    subscriber: user._id,
    channel: channelId,
  });

  // If user is not subscribed -> subscribe
  if (!userIsSubscribed) {
    subscribe = await Subscription.create({
      subscriber: user._id,
      channel: channelId,
    });

    if (!subscribe) {
      throw new ApiError(
        500,
        "Something went wrong while subscribing to the channel"
      );
    }
  } else {
    // If user is already subscriber -> unsubscribe
    unsubscribe = await Subscription.findOneAndDelete({
      subscriber: user._id,
      channel: channelId,
    });

    if (!unsubscribe) {
      throw new ApiError(500, "Something went wrong while unsubscribing ");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribe || unsubscribe, "Subscribed/Unsubscribed")
    );
});

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(404, "Channel not found");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscribers",
      },
    },
    {
      $project: {
        _id: 1,
        channel: 1,
        subscriber: 1,
        createdAt: 1,
        updatedAt: 1,
        subscribers: {
          $arrayElemAt: ["$subscribers", 0],
        },
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        subscribers: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!subscribers) {
    throw new ApiError(404, "The channel does not exist");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfSubscribers: subscribers.length,
        subscribers,
      },
      "Creating a function to get a channel's subscriber"
    )
  );
});

const getSusbcribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Subscriber does not exist");
  }

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "channels",
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          $arrayElemAt: ["$channels", 0],
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $project: {
        _id: 1,
        subscriber: 1,
        channel: 1,
        channels: {
          username: 1,
          avatar: 1,
        },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  if (!channels) {
    throw new ApiError(404, "The subscriber does not exist");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfChannelsSubscribedTo: channels.length,
        channels,
      },
      "Successfully fetched the number of channels user is subscribed to"
    )
  );
});

export { toggleSubscription, getChannelSubscribers, getSusbcribedChannels };
