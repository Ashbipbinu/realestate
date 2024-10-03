import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoute from './Routes/auth.routes.js';
import userRoute from './Routes/user.routes.js';
import listingRoute from './Routes/listing.routes.js';
import path from path;

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors());

const _dirname = path.resolve(); 

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/listing', listingRoute);


app.use(express.static(path.join(_dirname, '/frontend/dist')));
app.use("*", (req, res) => {
    res.sendFile(path.join(_dirname, 'frontend', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    console.log("err", err)
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
        console.log("Successfully connected to the database")
        console.log("Server lsitening to the PORT 3000");
    }).catch((err) => {
        console.log("Error while connecting to the database", err)
    })  
})