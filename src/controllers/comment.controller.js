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
  limit = Number(limit);

  if (!Number.isFinite(page)) {
    throw new ApiError(400, "Page is required");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(400, "Limit is required");
  }

  const allComments = await Comment.aggregate([
    {
      $match: {
        video: videoId,
      },
    },
  ]);

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(allComments),
    { page, limit }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, "Fetched all the comments on a video")
    );
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

const updateComment = asyncHandler(async (req, res) => {
  //TODO:
  // get comment Id
  // validate comment id
  // update the content of comment

  const { commentId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
    }
  );

  if (!comment) {
    throw new ApiError(500, "Something went wrong while updating comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Updated comment successfuly"));
});

const deleteComment = asyncHandler(async (req, res) => {
  //TODO:
  // get comment Id
  // validate comment id
  // delete the comment

  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid Comment Id");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(500, "Something went wrong while deleting the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Successfuly deleted the comment"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
