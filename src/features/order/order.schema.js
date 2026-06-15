import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Points to your Mongoose Product model
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false }); // Disable automatic _id creation for subdocuments inside the array

export const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Points to your Mongoose User model
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    items: [orderItemSchema],
    orderDate: {
        type: Date,
        default: Date.now
    }
});