import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartRepository{
    constructor(){
        this.collection = "cartItems";
    }

    async addProductInCart(productId, userId, quantity) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            console.log("DEBUG VALUES -> productId:", productId, " | userId:", userId);

            // 1. Guard Clause: Catch bad ID layouts before hitting the DB
            if (!ObjectId.isValid(productId) || !ObjectId.isValid(userId)) {
                throw new ApplicationError("Invalid format for Product ID or User ID supplied.", 400);
            }

            const pId = new ObjectId(productId);
            const uId = new ObjectId(userId);
            const qty = Number(quantity);

            // 2. Atomic Upsert operation
            // If a document matches this product and user, set the new quantity.
            // If it doesn't exist, 'upsert: true' inserts it as a fresh record!
            await collection.updateOne(
                { productId: pId, userId: uId },
                { $set: { quantity: qty } },
                { upsert: true }
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
            const db = getDB();
            const collection = db.collection(this.collection);
            if(!ObjectId.isValid(userId)){
                throw new ApplicationError("Invalid format for userId supplied", 400);
            }
            const userCart = await collection.find({userId: new ObjectId(userId)}).toArray();
            return userCart;
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
            const db = getDB();
            const collection = db.collection(this.collection);
            if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
                throw new ApplicationError("Invalid format for User ID or Product ID supplied.", 400);
            }

            const uId = new ObjectId(userId);
            const pId = new ObjectId(productId);
            const qty = Number(quantity);

            // Perform the atomic update
            const result = await collection.updateOne(
                { userId: uId, productId: pId },
                { $set: { quantity: qty } }  // Completely overwrites the old quantity with the new value
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
            const db = getDB();
            const collection = db.collection(this.collection);

            if (!ObjectId.isValid(cartItemId) || !ObjectId.isValid(userId)) {
                throw new ApplicationError("Invalid format for Cart Item ID or User ID supplied.", 400);
            }

            // Perform the atomic deletion targeting both fields for absolute security
            const result = await collection.deleteOne({
                _id: new ObjectId(cartItemId),
                userId: new ObjectId(userId)
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