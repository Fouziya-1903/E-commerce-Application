import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ProductModel, productSchema } from "./product.schema.js";
import { userSchema } from "../user/user.schema.js";
import { reviewSchema, ReviewModel } from "./review.schema.js";
import { CategoryModel } from "./category.schema.js";


export default class ProductRepository{


    constructor(){
        this.collection = "products";
    }


    async add(productData) {
        try {
            let categoryNames = productData.category || [];

            // If form-data sends a single text string (e.g. "mobilePhone"),
            // wrap it into an array format automatically so the loop doesn't split individual letters.
            if (typeof categoryNames === 'string') {
                categoryNames = [categoryNames];
            }

            const categoryIds = [];

            for (const name of categoryNames) {
                let category = await CategoryModel.findOne({ name: name.trim() });

                if (!category) {
                    category = new CategoryModel({ name: name.trim() });
                    await category.save();
                }

                categoryIds.push(category._id);
            }

            // Replace the text strings with the mapped ObjectIds
            productData.category = categoryIds;

            // Instantiate and save the product
            const newProduct = new ProductModel(productData);
            await newProduct.save();

            // Establish the Many-to-Many back-link relationship
            await CategoryModel.updateMany(
                { _id: { $in: categoryIds } },
                { $addToSet: { products: newProduct._id } }
            );

            return newProduct;
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with add product in database", 500);
        }
    }

    async getAllProducts(){
        try{
            return await ProductModel.find({});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with getAll products in database");
        }
    }

    async getOneProduct(id){
        try{
            return await ProductModel.findById(id);
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with getOne Product in database");
        }
    }

    async filter(minPrice, maxPrice, categoryName) {
        try {
            let filterExpression = {};

            // 1. Handle the price field safely
            if (minPrice || maxPrice) {
                filterExpression.price = {};
                if (minPrice) {
                    filterExpression.price.$gte = parseFloat(minPrice);
                }
                if (maxPrice) {
                    filterExpression.price.$lte = parseFloat(maxPrice);
                }
            }

            // 2. Fix the Category Lookup bug!
            if (categoryName) {
                // Find the category document by its text name first
                const foundCategory = await CategoryModel.findOne({ name: categoryName.trim() });
                
                if (foundCategory) {
                    // Use the valid dynamic ObjectId found in the cloud database to query products
                    filterExpression.category = foundCategory._id;
                } else {
                    // If the category name doesn't exist at all, force the query to return an empty array 
                    // instead of crashing or returning all items
                    return [];
                }
            }

            // 3. Execute the compound query
            return await ProductModel.find(filterExpression);
            
        } catch (err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with filtering products in database", 500);
        }
    }

    async rateProduct(userId, productId, rating) {
        try {
            const productToUpdate = await ProductModel.findById(productId);
            if(!productToUpdate){
                throw new ApplicationError("Product not found");
            }

            const userReview = await ReviewModel.findOne({productId: new ObjectId(productId), user: new ObjectId(userId)})
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }else{
                const newReview = new ReviewModel({
                    productId: new ObjectId(productId), 
                    user: new ObjectId(userId),
                    rating: rating
                });
                newReview.save();
            }
        }catch(err) {
            console.log(err);
            if (err instanceof ApplicationError) throw err;
            throw new ApplicationError("Something went wrong with rateProduct in database", 500);
        }    
    }

    async addCategory(categoryData) {
        try {
            // Explicitly trim the incoming name to avoid duplicates with empty spaces
            if (categoryData.name) {
                categoryData.name = categoryData.name.trim();
            }

            // Check if the category already exists to prevent an accidental duplicate crash
            const existingCategory = await CategoryModel.findOne({ name: categoryData.name });
            if (existingCategory) {
                throw new ApplicationError("Category already exists", 400);
            }

            const categoryDoc = new CategoryModel(categoryData);
            await categoryDoc.save();
            return categoryDoc;
        } catch (err) {
            console.log("Error inside addCategory repository:", err);
            if (err instanceof ApplicationError) throw err;
            throw new ApplicationError("Something went wrong with adding a category in database", 500);
        }
    }
    
    async avgProductPricePerCategory(){
        try{
            return await ProductModel.aggregate([
                    {
                        $group: {
                            _id: "$category",
                            averagePrice: {$avg: "$price"} 
                        }
                    }
                ]);
        }catch(err){
            console.log(err);
            if(err instanceof ApplicationError) throw err;
            throw new ApplicationError("Something went wrong with abgProductPricePerCategory in database", 500);
        }
    }
}
