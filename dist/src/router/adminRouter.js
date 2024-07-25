"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddelware_1 = __importDefault(require("../middleware/authMiddelware"));
const userController_1 = __importDefault(require("../controller/userController"));
const adminRouter = express_1.default.Router();
const authMiddleware = new authMiddelware_1.default();
const userController = new userController_1.default();
adminRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy);
adminRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability);
adminRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation);
adminRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request);
adminRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate);
adminRouter.patch("/close_request", authMiddleware.isValidUser, userController.closeRequest);
exports.default = adminRouter;
