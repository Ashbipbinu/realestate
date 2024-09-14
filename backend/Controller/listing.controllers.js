import Listing from "../Models/listing.model.js"

export const createListing = async (req, res, next) => {
    console.log("enter")
     try {
        const list = await Listing.create(req.body)
        res.status(201).json(list)
    } catch (error) {
        console.log("enter")
        next(error)
     }
}