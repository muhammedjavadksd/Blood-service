import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';
import { saveBloodRequestUpdateCertificate } from '../middleware/multerMiddleware';
import multer from 'multer';

const userRouter: Router = express.Router()

const authMiddleware = new AuthMiddleware();
const userController = new UserController();
const uploadCertificate = multer({ storage: saveBloodRequestUpdateCertificate })

userRouter.get("/get_profile", authMiddleware.isValidDonor, userController.getSingleProfile) // test pending
userRouter.get("/blood_availability/:blood_group/:status", userController.bloodAvailability) //test
userRouter.get("/blood_availability", userController.bloodAvailabilityByStatitics) //test
userRouter.get("/get_blood_requirements/:page/:limit", userController.findBloodRequirement)
userRouter.get("/find_request", authMiddleware.isValidDonor, userController.findRequest) //test pending // for getting request matched on my blood group
userRouter.get("/blood-requests", authMiddleware.isAuthenitcated, userController.myBloodRequest) //test pending
userRouter.get("/intrest/:request_id", authMiddleware.isValidDonor, userController.findRequest) //test pending
userRouter.get("/interested_blood_requirements", authMiddleware.isValidDonor, userController.findMyIntrest) //test pending
userRouter.get("/get_chats", authMiddleware.isValidDonor, authMiddleware.isAuthenitcated, userController.getMyChats) //test pending

userRouter.post("/intrest/:request_id", authMiddleware.isValidDonor, authMiddleware.isAuthenitcated, userController.showIntresrest) //test pending
userRouter.post("/create", userController.createBloodDonation) //test pending
userRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request) //test pending
userRouter.post("/group_change_request", authMiddleware.isValidDonor, userController.updateBloodGroup) //test pending
userRouter.post("/presigned_url_blood_group_change", authMiddleware.isValidDonor, userController.generatePresignedUrlForBloodGroupChange) //test pending

userRouter.patch("/close_request", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.closeRequest) //test pending
userRouter.patch("/update_donor", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.updateBloodDonor) //test pending


export default userRouter