import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
export const productRouter = express.Router();
const productController = new ProductController(); 

productRouter.get("/", (req, res, next)=>{
    productController.getAllProducts(req,res, next)
});
productRouter.get("/filter", (req,res, next)=>{
    productController.filterProduct(req,res, next)
});
productRouter.get("/:id", (req,res, next)=>{
    productController.getOneProduct(req,res, next)
});
productRouter.post("/",upload.single('imageUrl'), (req,res, next)=>{
    productController.addProduct(req,res, next)
});
productRouter.post("/rate",(req,res, next)=>{
    productController.rateProduct(req,res, next)
});