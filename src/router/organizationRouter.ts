import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';

const organizationRouter: Router = express.Router()
const authMiddleware = new AuthMiddleware();
const userController = new UserController();


organizationRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy)
organizationRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability)

organizationRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation)
organizationRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request)
organizationRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate)

organizationRouter.patch("/close_request", authMiddleware.isValidUser, userController.closeRequest)

export default organizationRouter