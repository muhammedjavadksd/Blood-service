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
const bloodDonorRepo_1 = __importDefault(require("../repo/bloodDonorRepo"));
const ImageService_1 = __importDefault(require("../service/ImageService"));
class UserController {
    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.updateBloodDonation = this.updateBloodDonation.bind(this);
        this.blood_request = this.blood_request.bind(this);
        this.blood_donate = this.blood_donate.bind(this);
        this.findNearBy = this.findNearBy.bind(this);
        this.bloodAvailability = this.bloodAvailability.bind(this);
        this.closeRequest = this.closeRequest.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.updateBloodDonor = this.updateBloodDonor.bind(this);
        this.updateBloodGroup = this.updateBloodGroup.bind(this);
        this.findRequest = this.findRequest.bind(this);
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.bloodService = new bloodService_1.default();
        this.bloodDonorRepo = new bloodDonorRepo_1.default();
        this.imageService = new ImageService_1.default();
    }
    findRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (req.context) {
                const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
                const findCases = yield this.bloodService.findRequest(donor_id);
                res.status(findCases.statusCode).json({ status: findCases.status, msg: findCases.msg });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
            }
        });
    }
    generatePresignedUrlForBloodGroupChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPresignedUrl = yield this.imageService.generatePresignedUrlForChangeBloodGroupCertificat();
            res.status(createdPresignedUrl.statusCode).json({ status: true, msg: createdPresignedUrl.msg, data: createdPresignedUrl.data });
        });
    }
    updateBloodGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            const newGroup = (_b = req.body) === null || _b === void 0 ? void 0 : _b.blood_group;
            const certificateName = (_c = req.body) === null || _c === void 0 ? void 0 : _c.certificate_name;
            const submiteRequest = yield this.bloodService.updateBloodGroupRequest(newGroup, donor_id, certificateName);
            res.status(submiteRequest.statusCode).json({ status: submiteRequest.status, msg: submiteRequest.msg });
        });
    }
    updateBloodDonor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bodyData = req.body;
            const editId = req.params.edit_id;
            let editableBloodDonors = {
                email_address: bodyData.email_address,
                full_name: bodyData.full_name,
                locatedAt: bodyData.locatedAt,
                phoneNumber: bodyData.phoneNumber
            };
            const updateDonor = yield this.bloodService.updateBloodDonors(editableBloodDonors, editId);
            res.status(updateDonor.statusCode).json({
                status: updateDonor.status,
                msg: updateDonor.msg
            });
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile_id = req.params.profile_id;
            const profile = yield this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
            console.log(profile_id);
            if (profile) {
                res.status(Enum_1.StatusCode.OK).json({ status: true, msg: "Profile fetched success", profile });
            }
            else {
                res.status(Enum_1.StatusCode.NOT_FOUND).json({ status: false, msg: "Invalid or wrong profile id" });
            }
        });
    }
    createBloodDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const fullName = req.body.full_name;
            const emailID = req.body.email_address;
            const phoneNumber = req.body.phone_number;
            const bloodGroup = req.body.bloodGroup;
            const location = req.body.location;
            // console.log(this);
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
        return __awaiter(this, void 0, void 0, function* () {
            const bloodGroup = req.params.blood_group;
            const status = req.params.status;
            const findBloodDonors = yield this.bloodService.findBloodAvailability(status, bloodGroup);
            res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status });
        });
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
                const donor_id = context.donor_id;
                const donation_id = req.params.donation_id;
                const status = req.params.status;
                const donateBlood = yield this.bloodService.donateBlood(donor_id, donation_id, status);
                res.status(donateBlood.statusCode).json({ status: donateBlood.status, msg: donateBlood.msg });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
            }
        });
    }
}
exports.default = UserController;
