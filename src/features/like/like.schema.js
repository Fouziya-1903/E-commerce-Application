import mongoose from "mongoose";

export const likeSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likeable: {
        type: mongoose.Schema.Types.ObjectId,
        //This is used for referring multiple types
        refPath: "modelType"
    },
    modelType:{
        type: String,
        enum: ['Product', 'Category']
    }
});

export const likeModel = mongoose.model('Like', likeSchema);