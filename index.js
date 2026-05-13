import dotenv from "dotenv";
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' with { type: 'json' };

import express from "express";
import {productRouter} from "./src/features/product/product.routes.js"
import { userRouter } from "./src/features/user/user.routes.js";
// import bodyParser from "body-parser";
// import multer from "multer";
// import { basicAuthorizer } from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import { cartRouter } from "./src/features/cart/cart.routes.js";

//Load the variables into process.env
dotenv.config();

const server = express();

server.use(express.json());
server.use("/api-docs",swagger.serve, swagger.setup(apiDocs));
// server.use("/api/products", basicAuthorizer, productRouter);
server.use("/api/products", jwtAuth, productRouter);   
server.use("/api/users", userRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use(express.static('uploads'));

server.get("/", (req,res)=>{
    res.send("Welcome to e commerce application");
})

server.listen(3000,()=>{    
    console.log("Server is running on port 3000");  
});