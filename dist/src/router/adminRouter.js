"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddelware_1 = __importDefault(require("../middleware/authMiddelware"));
const adminController_1 = __importDefault(require("../controller/adminController"));
const adminRouter = express_1.default.Router();
const authMiddleware = new authMiddelware_1.default();
const adminController = new adminController_1.default();
adminRouter.get("/blood_group_change_requests/:limit/:skip/:per_page/:status", authMiddleware.isValidAdmin, adminController.bloodGroupChangeRequests);
adminRouter.patch("/update_blood_group/:request_id/:new_status", authMiddleware.isValidAdmin, adminController.updateBloodGroup);
// adminRouter.get("/find_nearby", authMiddleware.isValidUser, userController.findNearBy)
// adminRouter.get("/blood_availability", authMiddleware.isValidUser, userController.bloodAvailability)
// adminRouter.post("/create", authMiddleware.isValidUser, userController.createBloodDonation)
// adminRouter.post("/blood_request", authMiddleware.isValidUser, userController.blood_request)
// adminRouter.post("/blood_donate/:donation_id", authMiddleware.isValidUser, userController.blood_donate)
// adminRouter.patch("/close_request", authMiddleware.isValidUser, userController.closeRequest)
exports.default = adminRouter;
