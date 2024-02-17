import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { page = 1, limit = 10 } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid video Id");
  }

  page = Number(page);
  limit = Number(page);

  if (!Number.isFinite(page)) {
    throw new ApiError(400, "Page is required");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(400, "Limit is required");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
  ]);

  console.log(comments);
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  if (!content) {
    throw new ApiError("Content is required");
  }

  const user = await User.find({
    refreshToken: req.cookies.refreshToken,
  });

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfuly"));
});

export { getVideoComments, addComment };
