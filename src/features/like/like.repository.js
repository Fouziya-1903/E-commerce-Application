import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { likeModel } from "./like.schema.js";

export class LikeRepository{
    async likeProduct(userId, productId){
        try{
            const newLike = new likeModel({
                user: userId, // no need of ObjectId(userId), mongoose handles it
                likeable: productId,
                modelType: 'Product'
            })

            await newLike.save();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with likeProduct in database", 500);
        }
    }

    async likeCategory(userId, categoryId){
        try{
            const newLike = new likeModel({
                user: userId,
                likeable: categoryId,
                modelType: 'Category'
            })

            await newLike.save();

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with likeCategory in database", 500);
        }   
    }

    async getLikes(id, type){
        try{
            let queryExpression = { likeable: new mongoose.Types.ObjectId(id) };

            if (type) {
                queryExpression.modelType = type;
            }

            return await likeModel.find(queryExpression)
                .populate('user')
                .populate({ path: 'likeable', model: type });
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with getLikes in database", 500);
        }
    }
}