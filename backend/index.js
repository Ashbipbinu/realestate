import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoute from './Routes/auth.routes.js';
import userRoute from './Routes/user.routes.js';
import listingRoute from './Routes/listing.routes.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/listing', listingRoute)

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = err.message || "Internal Server Error";
    return res.status(status).json({
        success: false,
        status,
        error,
    })
});

app.listen(3000, async() => {
    mongoose.connect(process.env.MONGO_URI).then(() =>{
        console.log("Successfully connected to the databse")
        console.log("Server lsitening to the PORT 3000");
    }).catch((err) => {
        console.log("Error while connecting to the database", err)
    })  
})