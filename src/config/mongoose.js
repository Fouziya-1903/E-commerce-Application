import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_url;

export const connectUsingMongoose = async ()=>{
    try{
        await mongoose.connect(url);
        console.log("Connected to MongoDB securely via Mongoose.");
    }catch(err){
        console.error("Mongoose connection initialization fallback fault:", err.message);
        process.exit(1); // Terminate the entire app instantly
        // process.exit(1) (Uncaught Failure): Tells the Operating System that the application crashed due to a severe error or missing dependency and was forced to terminate prematurely.
    }
}