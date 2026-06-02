import mongoose  from "mongoose";

export const productSchema = new mongoose.Schema(
    {
        name: String,
        desc: String, 
        price: Number,  
        inStock: Number,
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'
            } 
        ]
    },
    {
        timestamps: true
    }
);

export const ProductModel = mongoose.model('Product',productSchema);