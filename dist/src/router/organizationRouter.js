"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddelware_1 = __importDefault(require("../middleware/authMiddelware"));
const userController_1 = __importDefault(require("../controller/userController"));
const organizationRouter = express_1.default.Router();
const authMiddleware = new authMiddelware_1.default();
const userController = new userController_1.default();
organizationRouter.get("/find_nearby", authMiddleware.isAuthenitcated, userController.findNearBy);
organizationRouter.get("/blood_availability", authMiddleware.isAuthenitcated, userController.bloodAvailability);
organizationRouter.post("/create", authMiddleware.isAuthenitcated, userController.createBloodDonation);
organizationRouter.post("/blood_request", authMiddleware.isAuthenitcated, userController.blood_request);
organizationRouter.post("/blood_donate/:donation_id", authMiddleware.isAuthenitcated, userController.blood_donate);
organizationRouter.patch("/close_request", authMiddleware.isAuthenitcated, userController.closeRequest);
exports.default = organizationRouter;
