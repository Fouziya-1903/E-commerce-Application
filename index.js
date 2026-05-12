import express from "express";
import * as ProductRouter from "./src/features/product/product.routes.js"

const server = express();

server.use("/api/products", ProductRouter);


server.get("/", (re1,res)=>{
    res.send("Welcome to e commerce application");
})

server.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});