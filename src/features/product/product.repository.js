import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

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
            return await collection.find().toArray();
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

    async rateProduct(userId, productId, ratings){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);

            // 1. Guard Clause: Ensure both IDs are valid 24-character hex layouts before executing
            if (!ObjectId.isValid(userId) || !ObjectId.isValid(productId)) {
                throw new ApplicationError("Invalid format for User ID or Product ID supplied.", 400);
            }

            await collection.updateOne({
                _id: new ObjectId(productId)
            }, {
                $push: {ratings:{userId: new ObjectId(userId),ratings: Number(ratings)}}
            });
        }catch(err){
            console.log(err);
            if (err instanceof ApplicationError) throw err
            throw new ApplicationError("Something went wrong with getOne Product in database");
        }    
    }
}