import mongoose from "mongoose";
import { cartSchema } from "./cart.schema.js"
import { ApplicationError } from "../../error-handler/applicationError.js";

const cartModel = mongoose.model('Cart', cartSchema, 'cartItems');

export default class CartRepository{

    async addProductInCart(productId, userId, quantity) {
        try {

            const qty = Number(quantity);

            // 2. Atomic Upsert operation
            // If a document matches this product and user, set the new quantity.
            // If it doesn't exist, 'upsert: true' inserts it as a fresh record!
            return await cartModel.findOneAndUpdate(
                { productId: productId, userId: userId },
                { $set: { quantity: qty } },
                { upsert: true , new: true, runValidators: true}
            );

        } catch (err) {
            console.log(err);
            //If it's custom 400 validation error, pass it out directly
            if (err instanceof ApplicationError) throw err;
            
            // Otherwise, mask native database crashes with a safe 500 ApplicationError
            throw new ApplicationError("Something went wrong with the database transaction while adding to cart", 500);
        }
    }

    async getAllCartItems(userId){
        try{
            return await cartModel.find({userId: userId});
        }catch(err){
            console.log(err);
            // "Is this an error that I intentionally made earlier?"
            if(err instanceof ApplicationError){
                throw err;
            }
            // "No? It's a raw MongoDB crash." -> Mask it safely as a 500 Internal Error.
            throw new ApplicationError("Something went wrong with the database while retrieving your cart", 500);
        }
    }

    async updateCartItemQuantity(userId, productId, quantity){
        try{
            
            const qty = Number(quantity);

            // Perform the atomic update
            const result = await cartModel.updateOne(
                { userId: userId, productId: productId },
                { $set: { quantity: qty } },
                {runValidators: true}
            );

            //Target Verification: If no document matched, the item isn't in their cart
            if (result.matchedCount === 0) {
                throw new ApplicationError("This item was not found in your cart.", 404);
            }
        }catch(err){
            console.log(err);

            if(err instanceof ApplicationError){
                throw err;
            }
            throw new ApplicationError("Something went wrong while updating your cart item", 500);
        }
    }

    async deleteCartItem(cartItemId, userId) {
        try {
            const result = await cartModel.deleteOne({
                _id: cartItemId,
                userId: userId
            });

            // Inspect the execution result: If deletedCount is 0, nothing matched!
            if (result.deletedCount === 0) {
                //Predicted 404 error
                throw new ApplicationError("Cart item not found or you are not authorized to delete it.", 404);
            }

        } catch (err) {
            console.log(err);
            // Passing through our custom 400 or 404 errors completely untouched
            if (err instanceof ApplicationError) throw err;
            
            // Mask native database driver drops or crashes as a clean 500 error
            throw new ApplicationError("Something went wrong with the database while removing the item from your cart", 500);
        }
    }
}