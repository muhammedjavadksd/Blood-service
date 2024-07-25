"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddelware_1 = __importDefault(require("../middleware/authMiddelware"));
const userController_1 = __importDefault(require("../controller/userController"));
const userRouter = express_1.default.Router();
const authMiddleware = new authMiddelware_1.default();
const userController = new userController_1.default();
userRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy);
userRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability);
userRouter.get("/get_profile", userController.getSingleProfile);
userRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation); //test pending
userRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request); //test pending
userRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate);
userRouter.patch("/close_request", authMiddleware.isValidUser, authMiddleware.isValidReq, userController.closeRequest); //test pending
userRouter.patch("/update_donor/:edit_id", authMiddleware.isValidUser, authMiddleware.isValidReq, userController.closeRequest); //test pending
exports.default = userRouter;
