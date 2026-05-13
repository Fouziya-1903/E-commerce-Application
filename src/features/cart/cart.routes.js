import express from 'express';
import CartController from './cart.controller.js';

export const cartRouter = express();

const cartController = new CartController();
cartRouter.post("/", cartController.add);
cartRouter.get("/",cartController.getCart);
cartRouter.post("/delete",cartController.deleteCartItem);