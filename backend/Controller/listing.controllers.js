import Listing from "../Models/listing.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const createListing = async (req, res, next) => {
  console.log("enter");
  try {
    const list = await Listing.create(req.body);
    res.status(201).json(list);
  } catch (error) {
    console.log("enter");
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const isListingExist = await Listing.findById(req.params.id);
    if (!isListingExist) {
      next(errorHandler(404, "List not found"));
      return;
    }
    if (req.user._id !== isListingExist?.userRef.toString()) {
      return next(errorHandler(401, "You can delete your listings only"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(201).json("Deleted the listing successfully");
  } catch (error) {
    next(error);
  }
};
