import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
export const productRouter = express.Router();
const productController = new ProductController(); 

productRouter.get("/", (req, res, next)=>{
    productController.getAllProducts(req,res, next)
});
productRouter.get("/filter", (req,res, next)=>{
    productController.filterProduct(req,res, next)
});
productRouter.get("/averageProductPrice", (req, res, next)=>{
    productController.avgProductPrice(req,res,next);
})
productRouter.get("/:id", (req,res, next)=>{
    productController.getOneProduct(req,res, next)
});


productRouter.post("/",jwtAuth, upload.single('imageUrl'), (req,res, next)=>{
    productController.addProduct(req,res, next)
});
productRouter.post("/addCategory", jwtAuth, (req, res, next)=>{
    productController.addCateory(req,res,next);
});
productRouter.post("/rate", jwtAuth, (req,res, next)=>{
    productController.rateProduct(req,res, next)
});
