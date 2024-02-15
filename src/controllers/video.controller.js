import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    query,
    sortBy = "createdAt",
    sortType = 1, // Ascending
    userId,
  } = req.query;

  // Converting string to interger
  page = Number.parseInt(page);
  limit = Number.parseInt(limit);

  // Validation
  if (!Number.isFinite(page)) {
    throw new ApiError(404, "Page number should be integer");
  }

  if (!Number.isFinite(limit)) {
    throw new ApiError(404, "Video limit should be integer");
  }

  if (!query.trim()) {
    throw new ApiError(404, "Query is required");
  }

  // getting user
  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user._id) {
    throw new ApiError(404, "User not found");
  }

  // getting videos
  const videos = await Video.aggregate([
    {
      $match: {
        owner: user._id,
        title: {
          $regex: query.trim(),
          $options: "i",
        },
      },
    },
    {
      $sort: {
        [sortBy]: sortType,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        numOfVideos: videos.length,
        videos,
      },
      "Testing get All Videos"
    )
  );
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const user = await User.find({
    refreshToken: req.cookies.refreshToken,
  });

  if (!title) {
    throw new ApiError(404, "Title is required");
  }

  if (!description) {
    throw new ApiError(404, "Title is required");
  }

  let thumbnailLocalFile;
  if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
    thumbnailLocalFile = req.files.thumbnail[0].path;
  } else {
    throw new ApiError(404, "Video not found");
  }

  let videoLocalFile;
  if (req.files && req.files.video && req.files.video.length > 0) {
    videoLocalFile = req.files.video[0].path;
  } else {
    throw new ApiError(404, "Video not found");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalFile);
  const videoFile = await uploadOnCloudinary(videoLocalFile);

  if (!thumbnail) {
    throw new ApiError(500, "Could not upload thumbnail");
  }

  if (!videoFile) {
    throw new ApiError(500, "Could not upload video");
  }

  const video = await Video.create({
    title,
    description,
    owner: user[0]._id,
    thumbnail: thumbnail.url,
    thumbnailId: thumbnail.public_id,
    videoFile: videoFile.url,
    videoFileId: videoFile.public_id,
    duration: videoFile.duration,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Uploaded video successfuly"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  const video = await Video.findById(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Fetched video successfuly"));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(202, video, "Testing Update Video Details function"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  let videoLocalFile;

  if (req.file) {
    videoLocalFile = req.file.path;
  } else {
    throw new ApiError(400, "Video is required");
  }

  const video = await Video.findById(videoId);

  await deleteFromCloudinary(video.videoFileId);

  const videoFile = await uploadOnCloudinary(videoLocalFile);

  video.videoFile = videoFile.url;
  video.videoFileId = videoFile.public_id;
  video.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Updated successfuly"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  let thumbnailLocalFile;

  if (req.file) {
    thumbnailLocalFile = req.file.path;
  } else {
    throw new ApiError(400, "Thumbnail is required");
  }

  const video = await Video.findById(videoId);

  await deleteFromCloudinary(video.thumbnailId);

  const thumbnail = await uploadOnCloudinary(thumbnailLocalFile);

  video.thumbnail = thumbnail.url;
  video.thumbnailId = thumbnail.public_id;
  video.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Thumbnail Updated successfuly"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  const video = await Video.deleteOne({ _id: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfuly"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video not found");
  }

  const user = await User.find({
    refreshToken: req.cookies.refreshToken,
  });

  const video = await Video.findById(videoId);

  if (!user[0]._id.equals(video.owner)) {
    throw new ApiError(
      404,
      "You do not have permission to edit this video's settings"
    );
  }

  video.isPublished = !video.isPublished;
  video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Toggled publish status successfuly"));
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideoDetails,
  updateVideo,
  updateThumbnail,
  deleteVideo,
  togglePublishStatus,
};
