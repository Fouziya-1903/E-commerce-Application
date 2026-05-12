import express from "express";
import {productRouter} from "./src/features/product/product.routes.js"
import bodyParser from "body-parser";
import multer from "multer";

const server = express();

server.use(bodyParser.json());
server.use("/api/products", productRouter);
server.use(express.static('uploads'));

server.get("/", (req,res)=>{
    res.send("Welcome to e commerce application");
})

server.listen(3000,()=>{    
    console.log("Server is running on port 3000");  
});