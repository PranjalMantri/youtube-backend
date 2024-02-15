import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  res.status(200).json(
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

  res
    .status(200)
    .json(new ApiResponse(200, video, "Uploaded video successfuly"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get video from id
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  // TODO: Update video details like title, description and thumbnail

  //FIXME:
  // get video id
  // get video details like title, description
  // update the details in database

  const { videoId } = req.params;

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

  console.log(video);

  res
    .status(200)
    .json(new ApiResponse(202, video, "Testing Update Video Details function"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: Delete the video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideoDetails,
  deleteVideo,
  togglePublishStatus,
};
