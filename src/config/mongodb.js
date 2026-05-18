import { MongoClient } from "mongodb";

import dotenv from 'dotenv';

//load all the environment variables
dotenv.config();
const url = process.env.DB_url;

let client;
export const connectToMongoDB = ()=>{
    MongoClient.connect(url)
    .then((clientInstance)=>{
        client = clientInstance;
        console.log("Connected to MongoDB");
    })
    .catch((err)=>{
        console.log(err);
    })
}

export const getDB = ()=>{
    return client.db();
}

