import dotenv from "dotenv";
import swagger from 'swagger-ui-express';
import apiDocs from './swagger.json' with { type: 'json' };
import cors from "cors";
import winston from "winston";

import express from "express";
import {productRouter} from "./src/features/product/product.routes.js"
import { userRouter } from "./src/features/user/user.routes.js";
// import bodyParser from "body-parser";
// import multer from "multer";
// import { basicAuthorizer } from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import { cartRouter } from "./src/features/cart/cart.routes.js";
import loggerMiddleware, { logger } from "./src/middlewares/logger.middleware.js";
//Load the variables into process.env
dotenv.config();

const server = express();

let corsOptions = {
    origin:'http://localhost:5500',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}

server.use(cors(corsOptions));

// server.use((req, res, next)=>{
//     res.header("Access-Control-Allow,Origin", "http://127.0.0.1:5500/index.html")
//     res.header("Access-Control-Allow-Headers", '*');
//     res.header("Access-Control-Allow-Methods", '*');
//     if(req.method == "OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// });

server.use(express.json());
server.use("/api-docs",swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

// server.use("/api/products", basicAuthorizer, productRouter);
server.use("/api/products", jwtAuth, productRouter);   
server.use("/api/users", userRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use(express.static('uploads'));

server.get("/", (req,res)=>{
    res.send("Welcome to e commerce application");
})

server.use((err, req,res,next)=>{
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    console.log("Application Error:", err);
    res.status(503).send("Something went wrong, please try again later");
})

//Configure middleware to handle 404 request
server.use((req, res, next)=>{
    res.status(404).send("API is not found");
})

server.listen(3000,()=>{    
    console.log("Server is running on port 3000");  
});