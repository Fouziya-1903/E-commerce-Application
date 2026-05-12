import express from 'express';
import ProductController from './product.controller.js';
import ProductController from './product.controller.js';

export const router = express.router();

const productController = new ProductController(); 
router.get("/", productController.getAllProducts);
router.post("/", productController.addProduct);