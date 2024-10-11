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
const ImageService_1 = __importDefault(require("../service/ImageService"));
const UtilHelpers_1 = __importDefault(require("../Util/Helpers/UtilHelpers"));
const S3Helper_1 = __importDefault(require("../Util/Helpers/S3Helper"));
class UserController {
    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this);
        this.updateBloodDonation = this.updateBloodDonation.bind(this);
        this.blood_request = this.blood_request.bind(this);
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
        this.findMyIntrest = this.findMyIntrest.bind(this);
        this.myBloodRequest = this.myBloodRequest.bind(this);
        this.updateAccountStatus = this.updateAccountStatus.bind(this);
        this.requestUpdate = this.requestUpdate.bind(this);
        this.findDonationHistory = this.findDonationHistory.bind(this);
        this.findNearestDonors = this.findNearestDonors.bind(this);
        this.advanceBloodRequirement = this.advanceBloodRequirement.bind(this);
        this.bloodService = new bloodService_1.default();
        this.imageService = new ImageService_1.default();
    }
    findNearestDonors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloodGroup = req.params.group;
            const limit = +req.params.limit;
            const page = +req.params.page;
            const long = +(req.query.long || 0);
            const lati = +(req.query.lati || 0);
            const location = [long, lati];
            const findData = yield this.bloodService.findNearestBloodDonors(page, limit, location, false, bloodGroup);
            res.status(findData.statusCode).json({ status: findData.status, msg: findData.msg, data: findData.data });
        });
    }
    advanceBloodRequirement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = +req.params.page;
            const limit = +req.params.limit;
            const blood_group = req.params.blood_group;
            const urgency = Boolean(req.params.urgency);
            const hospital = req.params.hospital;
            const find = yield this.bloodService.advanceBloodBankSearch(page, limit, true, blood_group, urgency, hospital);
            res.status(find.statusCode).json({ status: find.status, msg: find.msg, data: find.data });
        });
    }
    findDonationHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            if (donor_id) {
                const findHistory = yield this.bloodService.donationHistory(donor_id, limit, page);
                res.status(findHistory.statusCode).json({ status: findHistory.status, msg: findHistory.msg, data: findHistory.data });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access" });
            }
        });
    }
    requestUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const request_id = req.params.requirement_id;
            const status = req.body.status;
            const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
            const unit = (_b = req.body) === null || _b === void 0 ? void 0 : _b.unit;
            if (profile_id) {
                const updateStatus = yield this.bloodService.updateRequestStatus(request_id, status, unit);
                res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access" });
            }
        });
    }
    updateAccountStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const status = req.body.status;
            console.log("Status");
            console.log(status);
            const updateStatus = status == true ? "Open" : Enum_1.BloodDonorStatus.Blocked;
            const reason = status != true ? Enum_1.DonorAccountBlockedReason.UserHideAccount : "";
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            let editableBloodDonors = {
                status: updateStatus,
                blocked_reason: reason
            };
            const updateDonor = yield this.bloodService.updateBloodDonors(editableBloodDonors, donor_id);
            console.log(updateDonor);
            res.status(updateDonor.statusCode).json({
                status: updateDonor.status,
                msg: updateDonor.msg
            });
        });
    }
    // async getMyChats(req: CustomRequest, res: Response): Promise<void> {
    //     const profile_id = req.context?.profile_id;
    //     if (profile_id) {
    //         const getMyChats = await this.chatService.getMyChats(profile_id);
    //         res.status(getMyChats.statusCode).json({ status: getMyChats.status, msg: getMyChats.msg, data: getMyChats.data })
    //     } else {
    //         res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized Access", })
    //     }
    // }
    myBloodRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
            const limit = +req.params.limit;
            const page = +req.params.page;
            const status = req.params.status;
            if (profile_id) {
                const findProfile = yield this.bloodService.findMyRequest(profile_id, page, limit, status);
                res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized Access", });
            }
        });
    }
    findMyIntrest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const donorId = (_a = req === null || req === void 0 ? void 0 : req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            const page = +req.params.page;
            const limit = +req.params.limit;
            const status = req.params.status;
            if (donorId) {
                const findMyIntrest = yield this.bloodService.findMyIntrest(donorId, limit, page, status);
                console.log(findMyIntrest);
                res.status(findMyIntrest.statusCode).json({ status: findMyIntrest.status, msg: findMyIntrest.msg, data: findMyIntrest.data });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized Access", });
            }
        });
    }
    showIntresrest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = req.context;
            const req_id = req.params.request_id;
            const profile_id = context === null || context === void 0 ? void 0 : context.profile_id;
            const utilHelper = new UtilHelpers_1.default();
            const token = utilHelper.getTokenFromHeader(req.headers['authorization']);
            if (profile_id && token) {
                const { donatedLast90Days = '', weight = '', seriousConditions = '', majorSurgeryOrIllness = '', surgeryOrIllnessDetails = '', chronicIllnesses = '', tattooPiercingAcupuncture = '', alcoholConsumption = '', tobaccoUse = '', pregnancyStatus = '', date = new Date() } = req.body;
                const validateDonorDetails = this.bloodService.bloodDonationInterestValidation({
                    donatedLast90Days,
                    weight,
                    seriousConditions,
                    majorSurgeryOrIllness,
                    surgeryOrIllnessDetails,
                    chronicIllnesses,
                    tattooPiercingAcupuncture,
                    alcoholConsumption,
                    tobaccoUse,
                    pregnancyStatus,
                    date
                });
                if (validateDonorDetails.errors.length) {
                    res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: validateDonorDetails.errors[0] });
                    return;
                }
                let concerns = validateDonorDetails.concerns;
                if (context) {
                    const donor_id = context === null || context === void 0 ? void 0 : context.donor_id;
                    const data = yield this.bloodService.showIntrest(token, profile_id, donor_id, req_id, concerns, date);
                    console.log(data);
                    res.status(data.statusCode).json({ status: data.status, msg: data.msg });
                }
                else {
                    res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
                }
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" });
            }
        });
    }
    findRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (req.context) {
                const profile_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.profile_id;
                const blood_id = (_b = req.params) === null || _b === void 0 ? void 0 : _b.request_id;
                const status = (_c = req.params) === null || _c === void 0 ? void 0 : _c.status;
                const page = +((_d = req.params) === null || _d === void 0 ? void 0 : _d.page);
                const limit = +((_e = req.params) === null || _e === void 0 ? void 0 : _e.limit);
                const findCases = yield this.bloodService.findRequest(profile_id, blood_id, page, limit, status);
                res.status(findCases.statusCode).json({ status: findCases.status, msg: findCases.msg, data: findCases.data });
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
            const s3Helper = new S3Helper_1.default(Enum_1.S3BucketsNames.bloodCertificate, Enum_1.S3FolderName.bloodCertification);
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            const newGroup = (_b = req.body) === null || _b === void 0 ? void 0 : _b.blood_group;
            const certificateName = (_c = req.body) === null || _c === void 0 ? void 0 : _c.presigned_url;
            const imageKey = utilHelper.extractImageNameFromPresignedUrl(certificateName);
            // `https://${bucketName}.s3.amazonaws.com/${imageKey}`
            if (certificateName && imageKey) {
                const findFile = yield s3Helper.findFile(imageKey);
                if (findFile) {
                    const certificate_name_from_presigned_url = `https://${Enum_1.S3BucketsNames.bloodCertificate}.s3.amazonaws.com/${imageKey}`;
                    const submiteRequest = yield this.bloodService.updateBloodGroupRequest(newGroup, donor_id, certificate_name_from_presigned_url);
                    res.status(submiteRequest.statusCode).json({ status: submiteRequest.status, msg: submiteRequest.msg });
                    return;
                }
            }
            res.status(Enum_1.StatusCode.BAD_REQUEST).json({ status: false, msg: "Image not found" });
        });
    }
    updateBloodDonor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const bodyData = req.body;
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            let editableBloodDonors = {
                email_address: bodyData.email_address,
                full_name: bodyData.full_name,
                phoneNumber: bodyData.phoneNumber
            };
            if (bodyData.locatedAt) {
                editableBloodDonors['location'] = bodyData.locatedAt;
                const coords = (_b = bodyData.locatedAt) === null || _b === void 0 ? void 0 : _b.coordinates;
                if (coords && coords.length) {
                    editableBloodDonors['location_coords'] = {
                        type: "Point",
                        coordinates: coords
                    };
                }
            }
            const updateDonor = yield this.bloodService.updateBloodDonors(editableBloodDonors, donor_id);
            res.status(updateDonor.statusCode).json({
                status: updateDonor.status,
                msg: updateDonor.msg
            });
        });
    }
    getSingleProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const donor_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.donor_id;
            const profile_id = (_b = req.context) === null || _b === void 0 ? void 0 : _b.profile_id;
            if (profile_id && donor_id) {
                const profile = yield this.bloodService.findDonorProfile(donor_id, profile_id); //await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
                console.log(profile);
                res.status(profile.statusCode).json({ status: profile.status, msg: profile.msg, data: profile.data });
            }
            else {
                console.log("This worked");
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "Invalid or wrong profile id" });
            }
        });
    }
    createBloodDonation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullName = req.body.full_name;
            const emailID = req.body.email_address;
            const phoneNumber = req.body.phone_number;
            const bloodGroup = req.body.bloodGroup;
            const locationBody = req.body.location;
            const location = {
                coordinates: [+locationBody.coordinates[0], +locationBody.coordinates[1]],
                type: "Point"
            };
            const createBloodDonor = yield this.bloodService.bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location, locationBody, Enum_1.BloodDonorStatus.Open);
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
                const locatedAt = req.body.location;
                const address = req.body.address;
                const phoneNumber = req.body.phoneNumber;
                const email_address = req.body.email_address;
                const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
                const profile_id = (_b = req.context) === null || _b === void 0 ? void 0 : _b.profile_id;
                const createdBloodRequest = yield this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, email_address);
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
            const bloodReqId = req.params.blood_id;
            const category = req.body.category;
            const explanation = req.body.explanation;
            const user_id = (_a = req.context) === null || _a === void 0 ? void 0 : _a.user_id;
            if (user_id) {
                const closeRequest = yield this.bloodService.closeRequest(bloodReqId, category, explanation);
                res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.msg });
            }
            else {
                res.status(Enum_1.StatusCode.UNAUTHORIZED).json({ status: false, msg: "User not found" });
            }
        });
    }
}
exports.default = UserController;
