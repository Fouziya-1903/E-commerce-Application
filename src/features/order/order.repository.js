import mongoose from "mongoose";
import { orderSchema } from "./order.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

const orderModel = mongoose.model('Order', orderSchema, 'orders');

export default class OrderRepository {

    async placeOrder(userId) {
        // Start a session straight from the main Mongoose instance connection pool
        const session = await mongoose.startSession();
        let finalizedOrderReceipt = null;

        try {
    
            await session.withTransaction(async () => {
                
                // 1. Fetch all items currently inside the user's cart using Mongoose
                
                const cartItems = await mongoose.model('Cart').find({ userId: userId }).session(session);

                if (cartItems.length === 0) {
                    throw new ApplicationError("Cannot place an order with an empty cart", 400);
                }

                // 2. ATOMIC STOCK VALIDATION & DECREMENTATION LOOP
                for (const item of cartItems) {
                    const itemQty = Number(item.quantity);
                    const stockUpdateResult = await mongoose.model('Product').updateOne(
                        {
                            _id: item.productId,
                            $or: [
                                { inStock: { $gte: itemQty } },
                                { inStock: { $exists: false } } // Safety guard if an old document lacks the property
                            ]
                        },
                        {
                            $inc: { inStock: -itemQty } 
                        },
                        { session }
                    );

                    // If matchedCount is 0, the item doesn't exist or live stock is too low
                    if (stockUpdateResult.matchedCount === 0) {
                        throw new ApplicationError(
                            `Transaction Aborted: Insufficient stock for product id ${item.productId}`, 
                            400
                        );
                    }
                }

                const totalAmount = await this.getTotalAmount(userId, session);

                const newOrder = new orderModel({
                    userId: userId,
                    totalAmount: totalAmount,
                    items: cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    })),
                    orderDate: new Date()
                });

                finalizedOrderReceipt = await newOrder.save({ session });
                await mongoose.model('Cart').deleteMany({ userId: userId }).session(session);
            });

            return finalizedOrderReceipt;

        } catch (err) {
            console.log("Transaction successfully rolled back due to error:", err.message);
            
            if (err instanceof ApplicationError) throw err;
            
            throw new ApplicationError(err.message || "Database transaction crash during order placement", err.statusCode || 500);
        } finally {
            // Terminate tracking sessions to clear memory
            await session.endSession();
        }
    }

    async getTotalAmount(userId, session) {
        try {
            
            const uId = new mongoose.Types.ObjectId(userId);

            const result = await mongoose.model('Cart').aggregate([
                
                { $match: { userId: uId } },
                
                
                {
                    $lookup: {
                        from: "products", 
                        localField: "productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },

                { $unwind: "$productDetails" },

                {
                    $project: {
                        userId: 1,
                        quantity: 1,
                        itemTotal: { $multiply: ["$quantity", "$productDetails.price"] }
                    }
                },

                {
                    $group: {
                        _id: "$userId",
                        grandTotal: { $sum: "$itemTotal" }
                    }
                }
            ], { session });

            return result.length > 0 ? result[0].grandTotal : 0;
        } catch (err) {
            console.log(err);
            throw new ApplicationError(err.message || "Failed to calculate total checkout aggregates", 500);
        }
    }
}