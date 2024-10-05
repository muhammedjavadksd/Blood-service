import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';
import AdminController from '../controller/adminController';

const adminRouter: Router = express.Router()

const authMiddleware = new AuthMiddleware();
const adminController = new AdminController();

adminRouter.get("/statitics", authMiddleware.isValidAdmin, adminController.getStatitics)
adminRouter.get("/blood_group_change_requests/:limit/:page/:status?", authMiddleware.isValidAdmin, adminController.bloodGroupChangeRequests)
adminRouter.get("/blood-requirements/:limit/:page/:status?", authMiddleware.isValidAdmin, adminController.getAllRequirements)
adminRouter.get("/blood-requirements/:blood_id", authMiddleware.isValidAdmin, adminController.viewSingleRequirement)
adminRouter.get("/find-donors/:limit/:page/:blood_group?", authMiddleware.isValidAdmin, adminController.findDonorByBloodGroup)
adminRouter.get("/nearest/:limit/:page/:blood_group", authMiddleware.isValidAdmin, adminController.findNearest)
adminRouter.get("/find-intrest/:blood_id/:limit/:page", authMiddleware.isValidAdmin, adminController.findIntrest)

adminRouter.post("/add-requirement", authMiddleware.isValidAdmin, adminController.addBloodRequirement)
adminRouter.post("/add-donor", authMiddleware.isValidAdmin, adminController.addDonor)

adminRouter.patch("/update_blood_group/:request_id/:new_status", authMiddleware.isValidAdmin, adminController.updateBloodGroup)
adminRouter.patch("/update-requirement-status/:requirement_id/:new_status", authMiddleware.isValidAdmin, adminController.updateBloodRequirements)


adminRouter.patch("/close_request/:blood_id", authMiddleware.isValidAdmin, adminController.closeRequest)

export default adminRouter