import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
    constructor() {
        this.collection = "orders";
    }

    async placeOrder(userId) {
        try {
            const db = getDB();
            const uId = new ObjectId(userId);

            // 1. Fetch all items currently inside the user's cart
            const cartItems = await db.collection("cartItems").find({ userId: uId }).toArray();

            if (cartItems.length === 0) {
                throw new ApplicationError("Cannot place an order with an empty cart", 400);
            }

            // 2. ATOMIC STOCK VALIDATION & DECREMENTATION LOOP
            // We iterate and decrement first. If any item fails, we flag it immediately.
            for (const item of cartItems) {
                const stockUpdateResult = await db.collection("products").updateOne(
                    {
                        _id: new ObjectId(item.productId),
                        stock: { $gte: item.quantity } // Database-level condition guard rail
                    },
                    {
                        $inc: { stock: -item.quantity } // Atomic calculation modification
                    }
                );

                // If matchedCount is 0, it means the product doesn't exist OR stock < item.quantity
                if (stockUpdateResult.matchedCount === 0) {
                    throw new ApplicationError(
                        `Transaction Aborted: Insufficient stock for product id ${item.productId}`, 
                        400
                    );
                }
            }

            // 3. Call internal aggregation method to get the final bill amount
            const totalAmount = await this.getTotalAmount(userId);

            // 4. Create final immutable historical order receipt document
            const newOrder = {
                userId: uId,
                totalAmount: totalAmount,
                items: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                orderDate: new Date()
            };

            // Write order document record to the database
            await db.collection(this.collection).insertOne(newOrder);

            // 5. Clear the shopping cart of the user after a successful purchase
            await db.collection("cartItems").deleteMany({ userId: uId });

            return newOrder;

        } catch (err) {
            console.log(err);
            if (err instanceof ApplicationError) throw err;
            throw new ApplicationError("Database transaction crash during order placement", 500);
        }
    }

    async getTotalAmount(userId) {
        try {
            const db = getDB();
            const uId = new ObjectId(userId);

            const result = await db.collection("cartItems").aggregate([
                // Filter the items only belonging to the current user
                { $match: { userId: uId } },
                
                // JOIN the target product info to read live prices
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },

                // Flattening the joined productDetails array
                { $unwind: "$productDetails" },

                // Project/calculate the total price for each cart item row
                {
                    $project: {
                        userId: 1,
                        quantity: 1,
                        itemTotal: { $multiply: ["$quantity", "$productDetails.price"] }
                    }
                },

                // Group all items together and compute the grand sum
                {
                    $group: {
                        _id: "$userId", // Corrected key mapping syntax grouping constraint
                        grandTotal: { $sum: "$itemTotal" }
                    }
                }
            ]).toArray();

            return result.length > 0 ? result[0].grandTotal : 0;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Failed to calculate total checkout aggregates", 500);
        }
    }
}