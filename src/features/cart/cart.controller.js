import { ApplicationError } from "../../error-handler/applicationError.js";
import CartRepository from "./cart.repository.js";
import CartModel from "./cart.model.js";

export default class CartController{
    constructor(){
        this.cartRepository = new CartRepository();
    }
    add = async (req, res, next)=>{
        
        const {productId, quantity} = req.query;
        const userId = req.userId;
        try{
            await this.cartRepository.addProductInCart(productId, userId, quantity);
            res.status(201).send("The item is added to the cart");
        }catch(err){
            console.log(err);
            //Forwards the custom ApplicationErrors straight to index.js middleware!
            next(err);        
        }
    }
    getCart = async (req, res, next)=>{
        const userId = req.userId;
        try{
            const cartItems = await this.cartRepository.getAllCartItems(userId);
            res.status(200).send(cartItems);
        }catch(err){
            console.log(err);
            next(err);
        }
    }
    updateCartItem = async (req,res, next)=>{
        const userId = req.userId;
        const {productId,quantity} = req.query;
        try{
            await this.cartRepository.updateCartItemQuantity(userId,productId,quantity);
            return res.status(200).send("cart item is successfully updated");
        }catch(err){
            console.log(err);
            next(err);
        }
    }

    deleteCartItem = async (req, res, next)=>{
        const userId = req.userId;
        const cartItemId = req.query.cartItemId;
        try{
            await this.cartRepository.deleteCartItem(cartItemId, userId);
           res.status(200).send("The cart item is deleted successfully"); 
        }catch(err){
            console.log(err);
            next(err);
        }
    } 
}