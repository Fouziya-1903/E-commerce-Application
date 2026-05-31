import mongoose, { Mongoose }  from "mongoose";

export const productSchema = new Mongoose.Schema(
    {
        name: String,
        desc: String, 
        price: Number, 
        category: String, 
        inStock: Number
    }
);