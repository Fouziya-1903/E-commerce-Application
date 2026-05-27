import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        try{
            const db = getDB();
            const uId = new ObjectId(userId);

            // Fetch all items currently inside the user's cart
            const cartItems = await db.collection("cartItems").find({userId: uId}).toArray();

            if(cartItems.length === 0){
                throw new ApplicationError("Cannot place an order with an empty cart");
            }

            //Call our internal method to get the final bill amount
            const totalAmount = await this.getTotalAmount(userId);

            //final order reciept document
            const newOrder = {
                userId: uId,
                totalAmount: totalAmount,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                orderDate: new Date()
            }

            //Write order document record to the collection database orders
            await db.collection(this.collection).insertOne(newOrder);

            //Reduce the stock volumes inside the products collection
            for(const item of cartItems){
                await db.collection("products").updateOne(
                    {_id: new ObjectId(item.productId)},
                    {$inc: {stock: -item.quantity}}
                );
            }

            //Clear the shopping cart of the user
            await db.collection("cartItems").deleteMany({userId: uId});

            return newOrder;
        }catch(err){
            console.log(err);
            if(err instanceof ApplicationError) throw err;
            throw new ApplicationError("database transaction crash during order placement", 500);
        }
    }

    async getTotalAmount(userId){
        try{
            const db = getDB();
            const uId = new ObjectId(userId);

            const result = db.collection("cartItems").aggregate([

                //filter the items only belonging to the current user
                { $match: {userId: uId} },
                
                //JOIN the target product info to read live prices
                {
                    $lookup: {
                        from : "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },

                //Flattening the joined productDetails array
                {
                    $unwind: "$productDetails"
                },

                //Project/ calculate the total price for each cart item row
                {
                    $project: {
                        userId: 1,
                        quantity: 1,
                        itemTotal: { $multiply: ["$quantity" , "$productDetails.price"]}
                    }
                },

                //Group all items together and compute the grand sum
                {
                    $group: {
                        _id: "userId",
                        grandTotal: {$sum: "$itemTotal"}
                    }
                }
            ]).toArray();

            return result.length > 0 ? result[0].grandTotal : 0;
        }catch(err){
            console.log(err);
        }
    }
}