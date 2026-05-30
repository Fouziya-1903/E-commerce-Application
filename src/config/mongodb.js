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
        createIndexes(client.db());
    })
    .catch((err)=>{
        console.log(err);
    })
}

export const getDB = ()=>{
    return client.db();
}

export const getClient = ()=>{
    return client;
}


const createIndexes = async(db)=>{
    try{
        await db.collection("products").createIndex({price: 1});
        await db.collection("products").createIndex({name: 1, category: -1});
        await db.collection("products").createIndex({desc: "text"});
        console.log('indexes are created');
    }catch(err){
        console.error("Failed to create indexes:", err);
    }
}
