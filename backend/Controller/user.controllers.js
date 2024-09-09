import User from "../Models/user.model.js";
import { errorHandler } from "../utils/error.handler.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.params.id !== req.user._id) {
    return next(errorHandler(401, "You can only update your own profile"));
  }
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    ); //new tru return the updated data
    const { password, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.user._id) {
    return next(errorHandler(401, "You can only delete your own profile"));
  }
  try {
    await User.findOneAndDelete({_id: req.user._id});
    res.clearCookie('access_token');
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    next(error);
  }
};
