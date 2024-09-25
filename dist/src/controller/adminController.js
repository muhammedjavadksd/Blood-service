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
const bloodService_1 = __importDefault(require("../service/bloodService"));
const Enum_1 = require("../Util/Types/Enum");
class AdminController {
    constructor() {
        this.getStatitics = this.getStatitics.bind(this);
        this.viewSingleRequirement = this.viewSingleRequirement.bind(this);
        this.findIntrest = this.findIntrest.bind(this);
        this.getAllRequirements = this.getAllRequirements.bind(this);
        this.findDonorByBloodGroup = this.findDonorByBloodGroup.bind(this);
        this.bloodService = new bloodService_1.default();
    }
    findIntrest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = +req.params.page;
            const limit = +req.params.limit;
            const blood_id = req.params.blood_id;
            const findBloodResponse = yield this.bloodService.findResponse(blood_id, page, limit);
            res.status(findBloodResponse.statusCode).json({ status: findBloodResponse.status, msg: findBloodResponse.msg, data: findBloodResponse.data });
        });
    }
    getStatitics(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const find = yield this.bloodService.getStatitics();
            res.status(find.statusCode).json({ status: find.status, msg: find.msg, data: find.data });
        });
    }
    findNearest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const lati = +(req.query.lati || 0);
            const long = +(req.query.long || 0);
            const page = +(req.params.page);
            const limit = +req.params.limit;
            const blood_group = req.params.blood_group;
            if (lati == null || lati == undefined || long == null || long == undefined) {
                res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please select valid location" });
            }
            else {
                const findNearest = yield this.bloodService.findNearestBloodDonors(page, limit, [long, lati], blood_group);
                res.status(findNearest.statusCode).json({ status: findNearest.status, msg: findNearest.msg, data: findNearest.data });
            }
        });
    }
    bloodBank(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const bloodGroup = req.params.bloodGroup;
            const isUrgent = req.query.is_urgent == "true";
            const hospital_id = (_a = req.query.hospital_id) === null || _a === void 0 ? void 0 : _a.toString();
            const bloodBank = yield this.bloodService.advanceBloodBankSearch(page, limit, bloodGroup, isUrgent, hospital_id);
            res.status(bloodBank.statusCode).json({ status: bloodBank.status, msg: bloodBank.msg, data: bloodBank.data });
        });
    }
    findDonorByBloodGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Reached here");
            const limit = +req.params.limit;
            const page = +req.params.page;
            const bloodGroup = req.params.blood_group;
            const findData = yield this.bloodService.searchBloodDonors(page, limit, bloodGroup, Enum_1.BloodDonorStatus.Open);
            res.status(findData.statusCode).json({ status: findData.status, msg: findData.msg, data: findData.data });
        });
    }
    viewSingleRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const req_id = req.params.blood_id;
            if (req_id) {
                const findRequirement = yield this.bloodService.findSingleBloodRequirement(req_id);
                res.status(findRequirement.statusCode).json({ status: findRequirement.status, msg: findRequirement.msg, data: findRequirement.data });
            }
            else {
                res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide valid data" });
            }
        });
    }
    closeRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blood_id = req.params.blood_id;
            if (blood_id) {
                const closeRequest = yield this.bloodService.closeRequest(blood_id, Enum_1.BloodCloseCategory.AdminClose, "Admin closed the requirement");
                res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.msg, data: closeRequest.data });
            }
            else {
                res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide valid data" });
            }
        });
    }
    addBloodRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const requestData = req.body.requestData;
            const patientName = requestData.patientName;
            const unit = requestData.unit;
            const neededAt = requestData.neededAt;
            const status = requestData.status;
            const blood_group = requestData.blood_group;
            const relationship = "Admin";
            const locatedAt = req.body.locatedAt;
            const address = req.body.address;
            const phoneNumber = req.body.phoneNumber;
            const email_address = req.body.email_address;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            const addRequirement = yield this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, user_id, blood_group, relationship, locatedAt, address, phoneNumber, email_address);
            res.status(addRequirement.statusCode).json({ status: addRequirement.status, msg: addRequirement.msg, data: addRequirement.data });
        });
    }
    updateBloodRequirements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blood_id = req.params.requirement_id;
            const status = req.params.new_status;
            const update = yield this.bloodService.updateProfileStatus(blood_id, status);
            res.status(update.statusCode).json({ status: update.status, msg: update.msg, data: update.data });
        });
    }
    getAllRequirements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const status = req.params.status;
            const bloodGroup = req.query.blood_group;
            const lang = (_a = req.query.lang) === null || _a === void 0 ? void 0 : _a.toString();
            const long = (_b = req.query.long) === null || _b === void 0 ? void 0 : _b.toString();
            const closedOnly = req.query.closed == "true";
            const location = (lang && long) ? [lang, long] : null;
            const findProfile = yield this.bloodService.findPaginatedBloodRequirements(page, limit, status, bloodGroup, location, closedOnly);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
        });
    }
    bloodGroupChangeRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = parseInt(req.params.limit);
            const page = parseInt(req.params.page);
            const status = req.params.status;
            const findRequets = yield this.bloodService.findBloodGroupChangeRequets(status, page, limit);
            res.status(findRequets.statusCode).json({ status: findRequets.status, msg: findRequets.msg, data: findRequets.data });
        });
    }
    updateBloodGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const request_id = req.params.request_id;
            const status = req.params.new_status;
            const updateBloodGroup = yield this.bloodService.updateBloodGroup(request_id, status);
            res.status(updateBloodGroup.statusCode).json({ status: updateBloodGroup.status, msg: updateBloodGroup.msg });
        });
    }
}
exports.default = AdminController;
