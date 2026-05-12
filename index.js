import express from "express";

const server = express();

server.get("/", (re1,res)=>{
    res.send("Welcome to e commerce application");
})

server.listen(3000);