import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';

const organizationRouter: Router = express.Router()
const authMiddleware = new AuthMiddleware();
const userController = new UserController();


organizationRouter.get("/find_nearby", authMiddleware.isAuthenitcated, userController.bloodAvailability)
organizationRouter.get("/blood_availability", authMiddleware.isAuthenitcated, userController.bloodAvailability)

organizationRouter.post("/create", authMiddleware.isAuthenitcated, userController.createBloodDonation)
organizationRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request)
organizationRouter.post("/blood_donate/:donation_id", authMiddleware.isAuthenitcated, userController.blood_donate)

organizationRouter.patch("/close_request", authMiddleware.isAuthenitcated, userController.closeRequest)

export default organizationRouter