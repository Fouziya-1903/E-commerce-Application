import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import e from "express";

export default class ProductRepository{


    constructor(){
        this.collection = "products";
    }

    async add(newProduct){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with add product in database");
        }
    }

    async getAllProducts(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find({}).toArray();
            return products;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with getAll products in database");
        }
    }

    async getOneProduct(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const product =  await collection.findOne({_id: new ObjectId(id)});
            return product;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with getOne Product in database");
        }
    }

    async filter(minPrice, maxPrice, category) {
    try {
        const db = getDB();
        const collection = db.collection(this.collection);

        let filterExpression = {};

        // 1. Handle the price field safely without wiping out keys
        if (minPrice || maxPrice) {
            filterExpression.price = {}; // Initialize an empty query sub-object
            
            if (minPrice) {
                filterExpression.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filterExpression.price.$lte = parseFloat(maxPrice);
            }
        }

        // 2. Handle the optional category string match
        if (category) {
            filterExpression.category = category;
        }

        // 3. Execute the compound query and convert the cursor stream to an array
        const filteredProducts = await collection.find(filterExpression).toArray();
        return filteredProducts;
        
        } catch (err) {
            console.log(err);
            // Corrected typo to log filter failures accurately inside your global error boundary
            throw new ApplicationError("Something went wrong with filtering products in database", 500);
        }
    }

    async rateProduct(userId, productId, ratings) {
        try {
            const db = getDB();
            const collection = db.collection(this.collection);

            // 1. Guard Clause: Ensure both IDs are valid 24-character hex layouts
            if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
                throw new ApplicationError("Invalid format for User ID or Product ID supplied.", 400);
            }

            const pId = new ObjectId(productId);
            const uId = new ObjectId(userId);
            const numericRating = Number(ratings);

            // 2. STEP 1: Try to update an existing score for this user
            const updateResult = await collection.updateOne(
                { 
                    _id: pId, 
                    "ratings.userId": uId 
                },
                { 
                    // ✅ FIXED: Using the positional operator ($) to update the specific matched index
                    $set: { "ratings.$.ratings": numericRating } 
                }
            );

            // 3. STEP 2: If no existing rating matched this user, push a fresh one instead
            // ✅ FIXED: Replaced 'if(numericRating)' with database match validation
            if (updateResult.matchedCount === 0) {
                await collection.updateOne(
                    { _id: pId }, 
                    {
                        $push: { 
                            ratings: { 
                                userId: uId,         // ✅ Clean reused variable
                                ratings: numericRating // ✅ Clean reused variable
                            } 
                        }
                    }
                );
            }
            
        }catch(err) {
            console.log(err);
            if (err instanceof ApplicationError) throw err;
            throw new ApplicationError("Something went wrong with rateProduct in database", 500);
        }    
    }
    
    async avgProductPricePerCategory(){
        try{
            const db = getDB();
            return await db.collection(this.collection).
                aggregate([
                    {
                        $group: {
                            _id: "$category",
                            averagePrice: {$avg: "$price"} 
                        }
                    }
                ]).toArray();
        }catch(err){
            console.log(err);
            if(err instanceof ApplicationError) throw err;
            throw new ApplicationError("Something went wrong with abgProductPricePerCategory in database", 500);
        }
    }
}
