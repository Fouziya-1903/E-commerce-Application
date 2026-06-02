import { LikeController } from "./like.controller.js";
import express from "express";

const likeController = new LikeController();
export const likeRouter = express.Router();

likeRouter.post('/', (req,res,next)=>{
    likeController.likeItem(req,res,next)
});

likeRouter.get("/", (req, res, next)=>{
    likeController.getLikes(req, res, next)
});