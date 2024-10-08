import Listing from "../Models/listing.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const createListing = async (req, res, next) => {
  try {
    const list = await Listing.create(req.body);
    res.status(201).json(list);
  } catch (error) {
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

    if (!isListingExist) {
      return next(errorHandler(404, "No listing found with this ID"));
    }
    if (req.user._id !== isListingExist?.userRef.toString()) {
      return next(errorHandler(401, "You can delete your listings only"));
    }
    const updatedListing = await Listing.findOneAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListById = async (req, res, next) => {
  try {
    const list = await Listing.findById(req.params.id);
    if (!list) {
      next(errorHandler(404, "List with this Id is not found"));
    }
    res.status(200).json(list); 
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
