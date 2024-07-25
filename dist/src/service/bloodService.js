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
const bloodReqRepo_1 = __importDefault(require("../repo/bloodReqRepo"));
const UtilHelpers_1 = __importDefault(require("../Util/Helpers/UtilHelpers"));
const bloodDonorRepo_1 = __importDefault(require("../repo/bloodDonorRepo"));
const bloodGroupUpdate_1 = __importDefault(require("../repo/bloodGroupUpdate"));
class BloodService {
    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.createBloodId = this.createBloodId.bind(this);
        this.bloodDonation = this.bloodDonation.bind(this);
        this.createDonorId = this.createDonorId.bind(this);
        this.closeRequest = this.closeRequest.bind(this);
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.bloodReqRepo = new bloodReqRepo_1.default();
        this.bloodDonorRepo = new bloodDonorRepo_1.default();
        this.bloodGroupUpdateRepo = new bloodGroupUpdate_1.default();
        this.utilHelper = new UtilHelpers_1.default();
    }
    findBloodGroupChangeRequets(status, page, limit, perPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const findRequests = yield this.bloodGroupUpdateRepo.findAllRequest(status, page, limit, perPage);
            if (findRequests.length) {
                return {
                    status: true,
                    msg: "Data fetched",
                    data: {
                        requests: findRequests
                    },
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "No request found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    updateBloodGroup(newGroup, profile_id, certificate_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBloodId = yield this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
            if (findBloodId) {
                if (findBloodId.blood_group != newGroup) {
                    const data = {
                        certificate: "",
                        date: new Date(),
                        donor_id: profile_id,
                        new_group: newGroup,
                        status: Enum_1.BloodGroupUpdateStatus.Pending
                    };
                    const saveData = yield this.bloodGroupUpdateRepo.saveRequest(data);
                    if (saveData) {
                        return {
                            msg: "Update request has been sent",
                            status: true,
                            statusCode: Enum_1.StatusCode.CREATED
                        };
                    }
                    else {
                        return {
                            msg: "The update request failed",
                            status: false,
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                }
                else {
                    return {
                        msg: "The new blood group is the same as the current blood group.",
                        status: false,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
            }
            else {
                return {
                    msg: "We couldn't find the blood profile.",
                    status: false,
                    statusCode: Enum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    updateBloodDonors(editData, edit_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDonor = yield this.bloodDonorRepo.updateBloodDonor(editData, edit_id);
            if (updateDonor) {
                return {
                    status: true,
                    msg: "Donor updated success",
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "Donor updation failed",
                    statusCode: Enum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    createDonorId(blood_group, fullName) {
        return __awaiter(this, void 0, void 0, function* () {
            let blood_id = fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5) + blood_group;
            let isDonorExist = yield this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
            while (isDonorExist) {
                blood_id = blood_group + fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5);
                isDonorExist = yield this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
            }
            return blood_id;
        });
    }
    createBloodId(blood_group, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            let blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
            let isUserExist = yield this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
            while (isUserExist) {
                blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
                isUserExist = yield this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
            }
            return blood_id;
        });
    }
    createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const blood_id = yield this.createBloodId(blood_group, unit);
            const createdBloodRequest = yield this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber);
            if (createdBloodRequest) {
                return {
                    msg: "Blood requirement created success",
                    status: true,
                    statusCode: Enum_1.StatusCode.CREATED,
                    data: {
                        blood_id: blood_id,
                        id: createdBloodRequest
                    }
                };
            }
            else {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: Enum_1.StatusCode.SERVER_ERROR,
                };
            }
        });
    }
    bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const BloodDonorId = yield this.createDonorId(bloodGroup, fullName);
            const saveData = {
                blood_group: bloodGroup,
                donor_id: BloodDonorId,
                email_address: emailID,
                full_name: fullName,
                locatedAt: location,
                phoneNumber: phoneNumber,
            };
            const saveDonorIntoDb = yield this.bloodDonorRepo.createDonor(saveData);
            if (saveDonorIntoDb) {
                return {
                    msg: "User inserted success",
                    status: true,
                    statusCode: Enum_1.StatusCode.CREATED,
                    data: {
                        donor_db_id: saveDonorIntoDb,
                        donor_id: BloodDonorId
                    }
                };
            }
            else {
                return {
                    msg: "User inserted failed",
                    status: false,
                    statusCode: Enum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
    closeRequest(blood_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bloodRequestion = yield this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
            if (bloodRequestion) {
                const updateData = yield this.bloodReqRepo.updateBloodDonor(blood_id, {
                    is_closed: true
                });
                if (updateData) {
                    return {
                        msg: "Requirement closed",
                        status: true,
                        statusCode: Enum_1.StatusCode.OK
                    };
                }
                else {
                    return {
                        msg: "Requirement closing failed",
                        status: false,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
            }
            else {
                return {
                    msg: "Internal server error",
                    status: false,
                    statusCode: Enum_1.StatusCode.SERVER_ERROR
                };
            }
        });
    }
}
exports.default = BloodService;
