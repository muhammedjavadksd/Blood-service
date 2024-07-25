import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';
import AdminController from '../controller/adminController';

const adminRouter: Router = express.Router()

const authMiddleware = new AuthMiddleware();
const adminController = new AdminController();

adminRouter.get("/blood_group_change_requests/:limit/:skip/:per_page/:status", authMiddleware.isValidAdmin, adminController.bloodGroupChangeRequests)


// adminRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy)
// adminRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability)

// adminRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation)
// adminRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request)
// adminRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate)

// adminRouter.patch("/close_request", authMiddleware.isValidUser, userController.closeRequest)

export default adminRouter