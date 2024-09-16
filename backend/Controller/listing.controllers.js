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

export const updateListing = async (req, res, next) => {
  try {
    const isListingExist = await Listing.findById(req.params.id);

    if(!isListingExist){
      return next(errorHandler(404, "No listing found with this ID"));
    }
    if (req.user._id !== isListingExist?.userRef.toString()) {
      return next(errorHandler(401, "You can delete your listings only"));
    }
    const updatedListing = await Listing.findOneAndUpdate(req.body.id,
      req.body,
      {new : true}
    )
     res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}

export const getListById = async (req, res, next) => {
  try {
    const list = await Listing.findById(req.params.id)
    if(list.userRef !== req.user._id){
      next(errorHandler(401, "List can be ediited only by the authorized users"))
    }
     if(!list){
      next(errorHandler(404, "List with this Id is not found"))
     }
     res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
