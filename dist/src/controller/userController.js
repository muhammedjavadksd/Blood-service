"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Enum_1 = require("../Util/Types/Enum");
const bloodService_1 = __importDefault(require("../service/bloodService"));
class UserController {
    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.bloodService = new bloodService_1.default();
        console.log(this);
    }
    createBloodDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const fullName = req.body.full_name;
            const emailID = req.body.email_address;
            const phoneNumber = req.body.phone_number;
            const bloodGroup = req.body.bloodGroup;
            const location = req.body.location;
            console.log(this);
            const createBloodDonor = yield this.bloodService.bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location);
            res.status(createBloodDonor.statusCode).json({
                status: createBloodDonor.status,
                msg: createBloodDonor.msg,
                data: createBloodDonor.data
            });
        });
    }
    updateBloodDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    findNearBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    bloodAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    blood_request(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = req.context;
            if (context) {
                const patientName = req.body.name;
                const unit = req.body.unit;
                const neededAt = req.body.needed_at;
                const status = Enum_1.BloodStatus.Pending;
                const user_id = context.user_id;
                const profile_id = context === null || context === void 0 ? void 0 : context.profile_id;
                const blood_group = req.body.blood_group;
                const relationship = req.body.relationship;
                const locatedAt = req.body.locatedAt;
                const address = req.body.address;
                const phoneNumber = req.body.phone_number;
                const createdBloodRequest = yield this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber);
                res.status(createdBloodRequest.statusCode).json({
                    status: createdBloodRequest.status,
                    msg: createdBloodRequest.msg,
                    data: createdBloodRequest.data
                });
            }
            else {
                res.status(Enum_1.StatusCode.SERVER_ERROR).json({
                    status: false,
                    msg: "Internal server error",
                });
            }
        });
    }
    closeRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bloodReqId = req.body.blood_req_id;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            if (user_id) {
                const closeRequest = yield this.bloodService.closeRequest(bloodReqId);
                res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.status });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "User not found" });
            }
        });
    }
    blood_donate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = req.context;
            if (context) {
                const user_id = context.user_id;
                const profile_id = context.profile_id;
                const donation_id = req.params.donation_id;
            }
        });
    }
}
exports.default = UserController;