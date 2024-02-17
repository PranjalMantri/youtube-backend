import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";
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
  //TODO: get playlist by id
  // get playlist id
  // validate playlist id
  // return the playlist with that id

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

export { createPlaylist, getUserPlaylist, getPlaylistById };
