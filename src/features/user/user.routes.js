import express from 'express';
import UserController from './user.controller.js';

export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signUp", userController.signUp);
userRouter.post('/signIn', userController.signIn);