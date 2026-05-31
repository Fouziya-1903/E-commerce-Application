import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js'

export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signUp", (req, res,next) => userController.signUp(req, res, next));
userRouter.post('/signIn', (req,res,next)=>{userController.signIn(req, res, next)});
userRouter.put('/resetPassword', jwtAuth, (req, res, next)=>{ userController.resetPassword(req, res, next)});