import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';
import { saveBloodRequestUpdateCertificate } from '../middleware/multerMiddleware';
import multer from 'multer';

const userRouter: Router = express.Router()

const authMiddleware = new AuthMiddleware();
const userController = new UserController();
const uploadCertificate = multer({ storage: saveBloodRequestUpdateCertificate })

userRouter.get("/get_profile", userController.getSingleProfile) // test pending
userRouter.get("/blood_availability/:blood_group/:status", authMiddleware.isValidUser, userController.bloodAvailability) //test
userRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy)

userRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation) //test pending
userRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request) //test pending
userRouter.post("/blood_donate/:donation_id/:status", authMiddleware.isValidUser, userController.blood_donate)
userRouter.post("/group_change_request", authMiddleware.isValidUser, uploadCertificate.single("certificate"), userController.updateBloodGroup) //test pending

userRouter.patch("/close_request", authMiddleware.isValidUser, authMiddleware.isValidReq, userController.closeRequest) //test pending
userRouter.patch("/update_donor/:edit_id", authMiddleware.isValidUser, authMiddleware.isValidReq, userController.closeRequest) //test pending


export default userRouter