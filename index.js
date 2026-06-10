import dotenv from "dotenv";
import swagger from 'swagger-ui-express';
import cors from "cors";
import express from "express";
import winston from "winston";

import {connectToMongoDB} from "./src/config/mongodb.js";
import { connectUsingMongoose } from "./src/config/mongoose.js";

import {productRouter} from "./src/features/product/product.routes.js"
import { userRouter } from "./src/features/user/user.routes.js";
import orderRouter from "./src/features/order/order.routes.js";
import { likeRouter } from "./src/features/like/like.routes.js";

// import bodyParser from "body-parser";
// import multer from "multer";
// import { basicAuthorizer } from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import { cartRouter } from "./src/features/cart/cart.routes.js";
import loggerMiddleware, { logger } from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";


import apiDocs from './swagger.json' with { type: 'json' };
import cartDocs from './src/features/cart/cart.swagger.json' with { type: 'json' };
import productDocs from './src/features/product/product.swagger.json' with {type: 'json'};
import userDocs from './src/features/user/user.swagger.json' with {type: 'json'};
import orderDocs from './src/features/order/order.swagger.json' with { type: 'json' };
import likeDocs from './src/features/like/like.swagger.json' with { type: 'json' };

//Load the variables into process.env
dotenv.config();

const server = express();

const completeSwaggerDocs = {
    ...apiDocs,
    paths: {
        ...apiDocs.paths,
        ...userDocs.paths,  
        ...productDocs.paths,
        ...cartDocs.paths,
        ...orderDocs.paths,
        ...likeDocs.paths
    },
    components: {
        ...apiDocs.components,
        schemas: {
            ...apiDocs.components?.schemas,
            ...userDocs.schemas,
            ...productDocs.schemas,
            ...cartDocs.schemas,
            ...orderDocs.schemas,
            ...likeDocs.schemas
        }
    }
};


let corsOptions = {
    origin:'http://localhost:5500',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}

server.use(cors(corsOptions));


server.use(express.json());

server.use("/api-docs", swagger.serve, swagger.setup(completeSwaggerDocs));

server.use(loggerMiddleware);

// server.use("/api/products", basicAuthorizer, productRouter);
server.use("/api/products", jwtAuth, productRouter);   
server.use("/api/users", userRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/like", jwtAuth, likeRouter);
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

    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }
    console.log("Application Error:", err);
    res.status(500).send("Something went wrong, please try again later");
})

//Configure middleware to handle 404 request
server.use((req, res, next)=>{
    res.status(404).send("API is not found");
})

server.listen(3000,()=>{    
    console.log("Server is running on port 3000");  
    connectUsingMongoose();
});