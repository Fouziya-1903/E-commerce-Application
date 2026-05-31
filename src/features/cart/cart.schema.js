import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema(
    {
        productId: {type: mongoose.Schema.ObjectId, ref:'products'},
        userId: {type: mongoose.Schema.ObjectId, ref:'users'},
        quantity: Number
    }
);