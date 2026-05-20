import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
export default class ProductController{

    constructor(){
        this.productRepository = new ProductRepository();
    }

    getAllProducts = async (req, res, next)=> {
        try{
            const products = await this.productRepository.getAllProducts();
            res.status(200).send(products);
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with getAll products in database", 400));
        }
        
    };

    addProduct = async (req, res, next)=> {
        try{
            const { name, desc, price, category, size } = req.body;

            const safeDesc = desc ? desc : ""; 
            const safeSize = size ? size.split(',') : [];
            
            const newProduct = new ProductModel({
                price: parseFloat(price),
                name: name,
                size: safeSize,
                imageUrl: req.file ? req.file.filename : "",
                category: category,
                desc: safeDesc
            });
            const productAdded = await this.productRepository.add(newProduct);
            res.status(201).send(productAdded);
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with add product in product controller"));
        }
    };

    // rateProduct(req, res){

    // };

    getOneProduct = async (req, res, next)=> {
        try{
            const id = req.params.id;
            const product = await this.productRepository.getOneProduct(id);
            if(product){
                res.status(200).send(product);
            }else{
                res.status(404).send("Product not found");
            }
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with getOneproduct in controller", 500));            
        }
    };

    filterProduct =  async (req, res, next)=> {

        try{    
            const {minPrice, maxPrice, category} = req.query;
            const result =await this.productRepository.filter(minPrice,maxPrice,category);
            return res.status(200).send(result);
        }catch(err){
            console.log(err);
            next(new ApplicationError("Something went wrong with filterProduct in controller", 500));    
        }
        
    };

    rateProduct = async (req, res, next)=> {
        const {userId, productId, ratings} = req.body;
        try{
            await this.productRepository.rateProduct(   
            userId,
            productId,
            ratings
            );
            return res.status(200).send("Successfully rated the product");

        }catch(err){
            console.log(err);
            next(err);        
        }
    }
}