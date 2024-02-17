import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Name is required");
  }

  if (!description) {
    throw new ApiError(400, "Description is required");
  }

  const user = await User.findOne({
    refreshToken: req.cookies.refreshToken,
  });

  if (!user) {
    throw new ApiError(400, "Could not find the user");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: user._id,
  });

  console.log(playlist);

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while creating a playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfuly"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const playlist = await Playlist.find({
    owner: userId,
  });

  if (!playlist) {
    throw new ApiError(400, "User does not have any platlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "User playlists fetched successfuly"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  console.log("Getting user playlists");
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist Id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while fetching playlists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Successfuly fetched the playlist by Id")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(
      500,
      "Something went wrong while adding videos to the playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video successfully added to the playlist")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist id");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exist");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    {
      new: true,
    }
  );

  if (!playlist) {
    throw new ApiError(
      500,
      "Something went wrong while removing videos from playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlist,
        "Video successfully removed from the playlist"
      )
    );
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
