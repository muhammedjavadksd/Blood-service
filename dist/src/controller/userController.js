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
const UtilHelpers_1 = __importDefault(require("../Util/Helpers/UtilHelpers"));
class UserController {
    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.updateBloodDonation = this.updateBloodDonation.bind(this);
        this.blood_request = this.blood_request.bind(this);
        this.blood_donate = this.blood_donate.bind(this);
        this.findBloodRequirement = this.findBloodRequirement.bind(this);
        this.bloodAvailability = this.bloodAvailability.bind(this);
        this.bloodAvailabilityByStatitics = this.bloodAvailabilityByStatitics.bind(this);
        this.closeRequest = this.closeRequest.bind(this);
        this.getSingleProfile = this.getSingleProfile.bind(this);
        this.updateBloodDonor = this.updateBloodDonor.bind(this);
        this.updateBloodGroup = this.updateBloodGroup.bind(this);
        this.findRequest = this.findRequest.bind(this);
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.generatePresignedUrlForBloodGroupChange = this.generatePresignedUrlForBloodGroupChange.bind(this);
        this.showIntresrest = this.showIntresrest.bind(this);
        this.bloodService = new bloodService_1.default();
        this.bloodDonorRepo = new bloodDonorRepo_1.default();
        this.imageService = new ImageService_1.default();
    }
    showIntresrest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const contex = req.context;
            const req_id = req.params.request_id;
            console.log(req.params);
            if (contex) {
                const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
                this.bloodService.showIntrest(donor_id, req_id).then((data) => {
                    res.status(data.statusCode).json({ status: data.status, msg: data.msg });
                }).catch((err) => {
                    res.status(Enum_1.StatusCode.SERVER_ERROR).json({ status: false, msg: "Something went wrong" });
                });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
            }
        });
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
            const utilHelper = new UtilHelpers_1.default();
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            const newGroup = (_b = req.body) === null || _b === void 0 ? void 0 : _b.blood_group;
            const certificateName = (_c = req.body) === null || _c === void 0 ? void 0 : _c.presigned_url;
            const certificate_name_from_presigned_url = `${Enum_1.S3BucketsNames.bloodCertificate}/${utilHelper.extractImageNameFromPresignedUrl(certificateName)}`;
            console.log(req.body);
            console.log(certificate_name_from_presigned_url);
            console.log(req.context);
            if (certificate_name_from_presigned_url) {
                const submiteRequest = yield this.bloodService.updateBloodGroupRequest(newGroup, donor_id, certificate_name_from_presigned_url);
                res.status(submiteRequest.statusCode).json({ status: submiteRequest.status, msg: submiteRequest.msg });
            }
            else {
                res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Image not found" });
            }
        });
    }
    updateBloodDonor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const bodyData = req.body;
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            let editableBloodDonors = {
                email_address: bodyData.email_address,
                full_name: bodyData.full_name,
                locatedAt: bodyData.locatedAt,
                phoneNumber: bodyData.phoneNumber
            };
            console.log("Editing details");
            console.log(editableBloodDonors);
            const updateDonor = yield this.bloodService.updateBloodDonors(editableBloodDonors, donor_id);
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
            console.log("Blood donor created");
            console.log(createBloodDonor);
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
    findBloodRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = +req.params.page;
            const limit = +req.params.limit;
            const findReq = yield this.bloodService.findActivePaginatedBloodRequirements(page, limit);
            console.log(findReq);
            res.status(findReq.statusCode).json({
                status: findReq.status,
                msg: findReq.msg,
                data: findReq.data
            });
        });
    }
    bloodAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloodGroup = req.params.blood_group;
            const status = req.params.status;
            const findBloodDonors = yield this.bloodService.findBloodAvailability(status, bloodGroup);
            res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status });
        });
    }
    bloodAvailabilityByStatitics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBloodDonors = yield this.bloodService.findBloodAvailability(Enum_1.BloodDonorStatus.Open);
            res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status });
        });
    }
    blood_request(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const context = req.context;
            const requestData = req.body;
            console.log("Context");
            console.log(context);
            if (context) {
                console.log(requestData.enquired_with_others);
                if (!requestData.enquired_with_others) {
                    res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Please ask your neighbors, friends, and relatives for blood donors first.This can provide a quicker response and helps save blood for others in need" });
                    return;
                }
                console.log("Request data");
                console.log(requestData);
                const patientName = requestData.patientName;
                const unit = requestData.unit;
                const neededAt = requestData.neededAt;
                const status = Enum_1.BloodStatus.Pending;
                const blood_group = requestData.blood_group;
                const relationship = req.body.relationship;
                const locatedAt = req.body.locatedAt;
                const address = req.body.address;
                const phoneNumber = req.body.phoneNumber;
                const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
                const profile_id = (_b = req.context) === null || _b === void 0 ? void 0 : _b.profile_id;
                const createdBloodRequest = yield this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber);
                console.log("Worked this");
                res.status(createdBloodRequest.statusCode).json({
                    status: createdBloodRequest.status,
                    msg: createdBloodRequest.msg,
                    data: createdBloodRequest.data
                });
            }
            else {
                console.log("This workeds");
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
