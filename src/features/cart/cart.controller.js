import e from "express";
import CartModel from "./cart.model.js";

export default class CartController{
    add(req, res){
        const {productId, quantity} = req.query;
        const userId = req.userId;
        CartModel.addProductInCart(productId, userId, quantity);
        res.status(201).send("The item is added to the cart");
    }
    getCart(req,res){
        const userId = req.userId;
        const cartItems = CartModel.getAllCartItems(userId);
        res.status(200).send(cartItems);
    }
    deleteCartItem(req, res){
        const userId = req.userId;
        const cartItemId = req.query.cartItemId;

        CartModel.deleteCartItem(cartItemId, userId);
        
       res.status(200).send("The cart item is deleted successfully"); 

    } 
}