import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";
import { likeModel } from "./like.schema.js";

export class LikeController{
    constructor(){
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req, res, next){
        try{
            const {id, type} = req.body;
            const userId = req.userId;

            if(type != 'Product' && type != 'Category'){
                return res.status(400).json({ success: false, message: 'Invalid type' });
            }

            if(type == 'Product'){
                await this.likeRepository.likeProduct(userId, id);
            }else{
                await this.likeRepository.likeCategory(userId, id);
            }

            return res.status(200).send();
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with getAll products in database", 400));
        }
    }

    async getLikes(req,res,next){
        try{
            const { id, type } = req.query;
            const likes = await this.likeRepository.getLikes(id, type);
            return res.status(200).send(likes);
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with getAll products in database", 400));
        }
    }
}