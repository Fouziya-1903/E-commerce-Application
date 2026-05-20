import express from 'express';
import UserController from './user.controller.js';

export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signUp", (req, res,next) => userController.signUp(req, res, next));
userRouter.post('/signIn', (req,res,next)=>{userController.signIn(req, res, next)});