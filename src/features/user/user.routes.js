import express from 'express';
import UserController from './user.controller.js';

export const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signUp", (req, res) => userController.signUp(req, res));
userRouter.post('/signIn', userController.signIn);