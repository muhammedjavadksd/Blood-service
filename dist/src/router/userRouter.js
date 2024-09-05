"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddelware_1 = __importDefault(require("../middleware/authMiddelware"));
const userController_1 = __importDefault(require("../controller/userController"));
const multerMiddleware_1 = require("../middleware/multerMiddleware");
const multer_1 = __importDefault(require("multer"));
const userRouter = express_1.default.Router();
const authMiddleware = new authMiddelware_1.default();
const userController = new userController_1.default();
const uploadCertificate = (0, multer_1.default)({ storage: multerMiddleware_1.saveBloodRequestUpdateCertificate });
userRouter.get("/get_profile", authMiddleware.isValidDonor, userController.getSingleProfile); // test pending
userRouter.get("/blood_availability/:blood_group/:status", userController.bloodAvailability); //test
userRouter.get("/blood_availability/:page/:limit/:blood_group/:urgency/:hospital", userController.bloodAvailability); //test
userRouter.get("/blood_availability", userController.bloodAvailabilityByStatitics); //test
userRouter.get("/get_blood_requirements/:page/:limit", userController.findBloodRequirement);
userRouter.get("/find_request", authMiddleware.isValidDonor, userController.findRequest); //test pending // for getting request matched on my blood group
userRouter.get("/blood-requests", authMiddleware.isAuthenitcated, userController.myBloodRequest); //test pending
userRouter.get("/intrest/:request_id", authMiddleware.isValidDonor, userController.findRequest); //test pending
userRouter.get("/interested_blood_requirements/:page/:limit", authMiddleware.isValidDonor, userController.findMyIntrest); //test pending
userRouter.get("/donation-history/:page/:limit", authMiddleware.isValidDonor, userController.findDonationHistory);
// userRouter.get("/get_chats", authMiddleware.isValidDonor, authMiddleware.isAuthenitcated, userController.getMyChats) //test pending
userRouter.post("/intrest/:request_id", authMiddleware.isValidDonor, authMiddleware.isAuthenitcated, userController.showIntresrest); //test pending
userRouter.post("/create", userController.createBloodDonation); //test pending
userRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request); //test pending
userRouter.post("/group_change_request", authMiddleware.isValidDonor, userController.updateBloodGroup); //test pending
userRouter.post("/presigned_url_blood_group_change", authMiddleware.isValidDonor, userController.generatePresignedUrlForBloodGroupChange); //test pending
userRouter.patch("/request_update/:requirement_id", authMiddleware.isAuthenitcated, authMiddleware.isValidRequired, userController.requestUpdate); //test pending
userRouter.patch("/close_request", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.closeRequest); //test pending
userRouter.patch("/update_donor", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.updateBloodDonor); //test pending
userRouter.patch("/account_status", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.updateBloodDonor); //test pending
exports.default = userRouter;
