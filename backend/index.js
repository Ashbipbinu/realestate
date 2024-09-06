import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const app = express();


app.listen(300, async() => {
    mongoose.connect(process.env.MONGO_URI).then(() =>{
        console.log("Successfully connected to the databse")
        console.log("Server lsitening to the PORT 3000");
    }).catch((err) => {
        console.log("Error while connecting to the database", err)
    })  
})