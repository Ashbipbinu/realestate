import express from 'express'
import { createListing, deleteListing } from '../Controller/listing.controllers.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing)


export default router