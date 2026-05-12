import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileUpload.middleware.js';
export const productRouter = express.Router();
const productController = new ProductController(); 

productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getOneProduct);
productRouter.post("/",upload.single('imageUrl'), productController.addProduct);
