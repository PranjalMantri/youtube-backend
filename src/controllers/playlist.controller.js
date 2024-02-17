import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Playlist } from "../models/playlist.model.js";

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

export { createPlaylist };
