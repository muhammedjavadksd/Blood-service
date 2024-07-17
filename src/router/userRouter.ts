import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';

const userRouter: Router = express.Router()
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

userRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request)


export default userRouter