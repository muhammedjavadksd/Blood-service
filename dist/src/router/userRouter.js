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
userRouter.get("/get_profile/:profile_id", authMiddleware.isValidDonor, userController.getSingleProfile); // test pending
userRouter.get("/blood_availability/:blood_group/:status", authMiddleware.isValidDonor, userController.bloodAvailability); //test
userRouter.get("/find_nearby", authMiddleware.isValidDonor, userController.findNearBy);
userRouter.get("/find_request", authMiddleware.isValidDonor, userController.findRequest); //test pending
userRouter.post("/create", authMiddleware.isValidDonor, userController.createBloodDonation); //test pending
userRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request); //test pending
userRouter.post("/blood_donate/:donation_id/:status", authMiddleware.isValidDonor, userController.blood_donate); //test pending
userRouter.post("/group_change_request", authMiddleware.isValidDonor, userController.updateBloodGroup); //test pending
userRouter.post("/presigned_url_blood_group_change", authMiddleware.isValidDonor, userController.generatePresignedUrlForBloodGroupChange); //test pending
userRouter.patch("/close_request", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.closeRequest); //test pending
userRouter.patch("/update_donor", authMiddleware.isValidDonor, authMiddleware.isValidReq, userController.updateBloodDonor); //test pending
exports.default = userRouter;
