import express, { Router } from 'express';
import AuthMiddleware from '../middleware/authMiddelware';
import UserController from '../controller/userController';

const userRouter: Router = express.Router()

const authMiddleware = new AuthMiddleware();
const userController = new UserController();

userRouter.get("/get_profile", authMiddleware.isAuthenitcated, authMiddleware.isValidDonor, userController.getSingleProfile) // test pending
userRouter.get("/blood_availability/:page/:limit/:blood_group?/:urgency?/:hospital?", userController.advanceBloodRequirement) //test
userRouter.get("/blood_availability", userController.bloodAvailabilityByStatitics) //test
userRouter.get("/get_blood_requirements/:page/:limit", userController.findBloodRequirement)
userRouter.get("/find_request", authMiddleware.isValidDonor, userController.findRequest) //test pending // for getting request matched on my blood group
userRouter.get("/blood-requests/:limit/:page/:status?", authMiddleware.isAuthenitcated, userController.myBloodRequest) //test pending
userRouter.get("/intrest/:request_id/:page/:limit/:status?", authMiddleware.isAuthenitcated, userController.findRequest) //test pending
userRouter.get("/interested_blood_requirements/:page/:limit/:status?", authMiddleware.isValidDonor, userController.findMyIntrest) //test pending
userRouter.get("/donation-history/:page/:limit", authMiddleware.isAuthenitcated, authMiddleware.isValidDonor, userController.findDonationHistory)
userRouter.get("/nearest-donors/:limit/:page/:group?", userController.findNearestDonors)

userRouter.post("/intrest/:request_id", authMiddleware.isValidDonor, authMiddleware.isAuthenitcated, userController.showIntresrest) //test pending
userRouter.post("/create", authMiddleware.isAuthenitcated, userController.createBloodDonation) //test pending
userRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request) //test pending
userRouter.post("/group_change_request", authMiddleware.isValidDonor, userController.updateBloodGroup) //test pending
userRouter.post("/presigned_url_blood_group_change", authMiddleware.isValidDonor, userController.generatePresignedUrlForBloodGroupChange) //test pending

userRouter.patch("/request_update/:requirement_id", authMiddleware.isAuthenitcated, authMiddleware.isValidRequired, userController.requestUpdate) //test pending
userRouter.patch("/close_request/:blood_id", authMiddleware.isAuthenitcated, authMiddleware.isValidDonor, userController.closeRequest) //test pending
userRouter.patch("/update_donor", authMiddleware.isValidDonor, userController.updateBloodDonor) //test pending
userRouter.patch("/account_status", authMiddleware.isValidDonor, userController.updateAccountStatus) //test pending


export default userRouter