import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';

const userRouter: Router = express.Router()
const authMiddleware = new AuthMiddleware();
const userController = new UserController();

userRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy)
userRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability)

userRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation)
userRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request)
userRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate)

userRouter.patch("/close_request", authMiddleware.isValidUser, userController.closeRequest)


export default userRouter