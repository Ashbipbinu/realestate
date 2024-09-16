import express from 'express'
import { createListing, deleteListing, updateListing, getListById } from '../Controller/listing.controllers.js'
import { verifyToken } from '../utils/verifyToken.js'

const router = express.Router()
router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
router.get('/get/:id', verifyToken, getListById)


export default router