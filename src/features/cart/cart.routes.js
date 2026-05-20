import express from 'express';
import CartController from './cart.controller.js';

export const cartRouter = express();

const cartController = new CartController();
cartRouter.post("/", (req,res,next)=>{
    cartController.add(req,res,next);
});
cartRouter.get("/",(req,res,next)=>{
    cartController.getCart(req,res,next);
});
cartRouter.post("/delete",(req,res,next)=>{
    cartController.deleteCartItem(req,res,next);
});
cartRouter.put('/update',(req,res,next)=>{
    cartController.updateCartItem(req,res,next);
})