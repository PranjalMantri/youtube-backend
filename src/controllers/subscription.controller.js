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

  let subscibe, unsubscribe;

  const userIsSubscribed = await Subscription.findOne({
    subsciber: user._id,
    channel: channelId,
  });

  // If user is not subscribed -> subscribe
  if (!userIsSubscribed) {
    subscibe = await Subscription.create({
      subsciber: user._id,
      channel: channelId,
    });

    if (!subscibe) {
      throw new ApiError(
        500,
        "Something went wrong while subscribing to the channel"
      );
    }
  } else {
    // If user is already subscriber -> unsubscribe
    unsubscribe = await Subscription.findOneAndDelete({
      subsciber: user._id,
      channel: channelId,
    });

    if (!unsubscribe) {
      throw new ApiError(500, "Something went wrong while unsubscribing ");
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscibe || unsubscribe,
        "Creating the toggle subscription functionality"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
});

const getSusbcribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSusbcribedChannels };
