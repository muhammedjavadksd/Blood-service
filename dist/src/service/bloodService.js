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
const bloodDonation_1 = __importDefault(require("../repo/bloodDonation"));
const tokenHelper_1 = __importDefault(require("../Util/Helpers/tokenHelper"));
const notification_service_1 = __importDefault(require("../communication/Provider/notification_service"));
class BloodService {
    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.createBloodId = this.createBloodId.bind(this);
        this.bloodDonation = this.bloodDonation.bind(this);
        this.createDonorId = this.createDonorId.bind(this);
        this.closeRequest = this.closeRequest.bind(this);
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.findMyIntrest = this.findMyIntrest.bind(this);
        this.bloodReqRepo = new bloodReqRepo_1.default();
        this.bloodDonorRepo = new bloodDonorRepo_1.default();
        this.bloodGroupUpdateRepo = new bloodGroupUpdate_1.default();
        this.bloodDonationRepo = new bloodDonation_1.default();
        this.utilHelper = new UtilHelpers_1.default();
    }
    findMyRequest(profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findRequest = yield this.bloodReqRepo.findUserRequirement(profile_id);
            if (findRequest.length) {
                return {
                    status: true,
                    msg: "Fetch all profile",
                    data: {
                        profile: findRequest
                    },
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "No profile found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    findMyIntrest(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const myIntrest = yield this.bloodReqRepo.findMyIntrest(donor_id);
            if (myIntrest.length) {
                return {
                    status: true,
                    msg: "Fetched all intrest",
                    data: {
                        profile: myIntrest
                    },
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "No data found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    bloodDonationInterestValidation(data) {
        const errors = [];
        const concerns = {
            seriousConditions: [],
            majorSurgeryOrIllness: null,
            chronicIllnesses: false,
            tobaco_use: false
        };
        const { donatedLast90Days = true, weight = '', seriousConditions = [], majorSurgeryOrIllness = false, surgeryOrIllnessDetails = '', chronicIllnesses = '', tattooPiercingAcupuncture = '', alcoholConsumption = '', tobaccoUse = '', pregnancyStatus = '', date = new Date() } = data;
        if (!donatedLast90Days) {
            errors.push('Donation status for the last 90 days is required.');
        }
        else if (donatedLast90Days === true) {
            errors.push("You can't donate since you have already donated in the last 90 days.");
        }
        if (!weight) {
            errors.push('Weight is required.');
        }
        else if (isNaN(Number(weight)) || Number(weight) < 50) {
            errors.push("You can't donate since you do not have sufficient weight.");
        }
        if (seriousConditions.length > 0) {
            concerns.seriousConditions = [...seriousConditions];
        }
        if (majorSurgeryOrIllness === 'true') {
            concerns.majorSurgeryOrIllness = surgeryOrIllnessDetails;
        }
        if (chronicIllnesses === 'true') {
            concerns.chronicIllnesses = true;
        }
        if (tattooPiercingAcupuncture === 'true') {
            errors.push('You can\'t donate blood since you have had tattoos, piercings, or acupuncture recently.');
        }
        if (alcoholConsumption === 'true') {
            errors.push('You can\'t donate blood since you have consumed alcohol in the last 48 hours.');
        }
        if (tobaccoUse == 'true') {
            concerns.tobaco_use = true;
        }
        if (pregnancyStatus == "true") {
            errors.push('You can\'t donate blood if you are pregnant.');
        }
        return {
            errors,
            concerns,
        };
    }
    showIntrest(donor_id, request_id, concerns, date) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const findRequirement = yield this.bloodReqRepo.findBloodRequirementByBloodId(request_id);
            console.log(request_id);
            console.log("7");
            if (findRequirement) {
                const findDonor = yield this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
                if ((findDonor === null || findDonor === void 0 ? void 0 : findDonor.status) == Enum_1.BloodDonorStatus.Open) {
                    if (findRequirement.neededAt < date) {
                        console.log("6");
                        return {
                            status: false,
                            msg: "The selected date is beyond the expected range.",
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                    const bloodDonationData = {
                        concerns,
                        date: new Date(),
                        meet_expect: date,
                        donation_id: request_id,
                        donor_id: donor_id,
                        status: Enum_1.BloodDonationStatus.Pending
                    };
                    const newIntrest = yield this.bloodDonationRepo.saveDonation(bloodDonationData); //  await this.bloodReqRepo.addIntrest(donor_id, request_id);
                    console.log(newIntrest);
                    if (newIntrest) {
                        console.log("5");
                        return {
                            status: true,
                            msg: "You have showed intrested on this request",
                            statusCode: Enum_1.StatusCode.OK
                        };
                    }
                    else {
                        console.log("4");
                        return {
                            status: false,
                            msg: "You've already shown interest in this.",
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                }
                else if ((findDonor === null || findDonor === void 0 ? void 0 : findDonor.status) == Enum_1.BloodDonorStatus.Blocked) {
                    const blockedReason = (_a = findDonor.blocked_reason) !== null && _a !== void 0 ? _a : Enum_1.DonorAccountBlockedReason.AlreadyDonated;
                    console.log("3");
                    return {
                        status: true,
                        msg: blockedReason,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
                else {
                    console.log("2");
                    return {
                        status: false,
                        msg: Enum_1.DonorAccountBlockedReason.AccountDeleted,
                        statusCode: Enum_1.StatusCode.UNAUTHORIZED
                    };
                }
            }
            else {
                console.log("1");
                return {
                    status: false,
                    msg: "The patient no longer needs blood. Thank you.",
                    statusCode: Enum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    findActivePaginatedBloodRequirements(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const findReq = yield this.bloodReqRepo.findActiveBloodReqPaginted(limit, (page - 1) * limit);
            if (findReq.length) {
                return {
                    status: true,
                    msg: "Request fetched",
                    statusCode: Enum_1.StatusCode.OK,
                    data: {
                        profile: findReq
                    }
                };
            }
            else {
                return {
                    status: false,
                    msg: "No data found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND
                };
            }
        });
    }
    findRequest(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findDonor = yield this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
            if (findDonor) {
                const bloodGroup = findDonor.blood_group;
                const request = yield this.bloodReqRepo.findActiveBloodReq(bloodGroup);
                return {
                    status: true,
                    msg: "Request fetched",
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "Unauthorized access.",
                    statusCode: Enum_1.StatusCode.UNAUTHORIZED
                };
            }
        });
    }
    // async donateBlood(donor_id: string, donation_id: string, status: BloodDonationStatus): Promise<HelperFunctionResponse> {
    //     const insertRequest: IBloodDonateTemplate = {
    //         date: new Date(),
    //         donation_id,
    //         status,
    //         donor_id
    //     }
    //     const findDonor = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
    //     if (findDonor) {
    //         if (findDonor.status == BloodDonorStatus.Blocked || findDonor.status == BloodDonorStatus.Deleted) {
    //             return {
    //                 msg: "You cannot process this request as your account is blocked for 90 days.",
    //                 status: false,
    //                 statusCode: StatusCode.BAD_REQUEST
    //             }
    //         } else {
    //             const saveData = await this.bloodDonationRepo.saveDonation(insertRequest);
    //             if (saveData) {
    //                 if (status == BloodDonationStatus.Approved) {
    //                     const blockDonor = await this.bloodDonorRepo.blockDonor(donor_id, DonorAccountBlockedReason.AlreadyDonated)
    //                     return {
    //                         msg: "Please go through the email; you will receive the remaining details",
    //                         status: true,
    //                         statusCode: StatusCode.OK
    //                     }
    //                 } else {
    //                     return {
    //                         msg: "Rejected success",
    //                         status: true,
    //                         statusCode: StatusCode.OK
    //                     }
    //                 }
    //             } else {
    //                 return {
    //                     msg: "Internal server error",
    //                     status: false,
    //                     statusCode: StatusCode.SERVER_ERROR
    //                 }
    //             }
    //         }
    //     } else {
    //         return {
    //             msg: "We couldn't find the donor",
    //             status: false,
    //             statusCode: StatusCode.UNAUTHORIZED
    //         }
    //     }
    // }
    findBloodAvailability(status, blood_group) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBloodAvailabilityFilter = {};
            let result = {
                [Enum_1.BloodGroup.A_POSITIVE]: 0,
                [Enum_1.BloodGroup.A_NEGATIVE]: 0,
                [Enum_1.BloodGroup.B_POSITIVE]: 0,
                [Enum_1.BloodGroup.B_NEGATIVE]: 0,
                [Enum_1.BloodGroup.AB_POSITIVE]: 0,
                [Enum_1.BloodGroup.AB_NEGATIVE]: 0,
                [Enum_1.BloodGroup.O_POSITIVE]: 0,
                [Enum_1.BloodGroup.O_NEGATIVE]: 0,
            };
            if (status) {
                findBloodAvailabilityFilter.status = status;
            }
            if (blood_group) {
                findBloodAvailabilityFilter.blood_group = blood_group;
            }
            const findDonors = yield this.bloodDonorRepo.findDonors(findBloodAvailabilityFilter);
            if (findDonors.length) {
                for (let index = 0; index < findDonors.length; index++) {
                    if (result[findDonors[index].blood_group] != null) {
                        console.log(result[findDonors[index].blood_group]);
                    }
                    else {
                        result[findDonors[index].blood_group] = 0;
                    }
                }
                return {
                    status: true,
                    msg: "Data fetched success",
                    statusCode: Enum_1.StatusCode.OK,
                    data: result
                };
            }
            else {
                return {
                    status: false,
                    msg: "No donors found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
    updateBloodGroup(request_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBloodGroup = yield this.bloodGroupUpdateRepo.findRequestById(request_id);
            if (findBloodGroup) {
                const updateData = {};
                if (findBloodGroup.status == Enum_1.BloodGroupUpdateStatus.Pending && newStatus == Enum_1.BloodGroupUpdateStatus.Completed) {
                    updateData.new_group = findBloodGroup.new_group;
                    updateData.status = Enum_1.BloodGroupUpdateStatus.Completed;
                }
                else if (findBloodGroup.status == Enum_1.BloodGroupUpdateStatus.Pending && newStatus == Enum_1.BloodGroupUpdateStatus.Rejected) {
                    updateData.status = Enum_1.BloodGroupUpdateStatus.Rejected;
                }
                else {
                    return {
                        msg: "Blood group update is not allowed",
                        status: false,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
                const upateBloodGroup = yield this.bloodGroupUpdateRepo.updateRequest(request_id, updateData);
                if (upateBloodGroup) {
                    return {
                        msg: "Blood group updated success",
                        status: true,
                        statusCode: Enum_1.StatusCode.OK
                    };
                }
                else {
                    return {
                        msg: "Blood group updated failed",
                        status: false,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
            }
            else {
                return {
                    msg: "Blood group not found.",
                    status: false,
                    statusCode: Enum_1.StatusCode.NOT_FOUND
                };
            }
        });
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
    updateBloodGroupRequest(newGroup, profile_id, certificate_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBloodId = yield this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
            console.log(findBloodId);
            if (findBloodId) {
                if (findBloodId.blood_group != newGroup) {
                    const data = {
                        certificate: certificate_name,
                        date: new Date(),
                        donor_id: profile_id,
                        new_group: newGroup,
                        status: Enum_1.BloodGroupUpdateStatus.Pending
                    };
                    const saveData = yield this.bloodGroupUpdateRepo.saveRequest(data);
                    console.log(saveData);
                    console.log("Saved data");
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
            console.log(updateDonor);
            console.log(edit_id, editData);
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
            const createdBloodRequest = yield this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, false);
            // const notification =
            //     console.log(createdBloodRequest);
            console.log("Passed one");
            const matchedProfile = yield this.bloodDonorRepo.findDonors({ status: Enum_1.BloodDonorStatus.Open, blood_group: blood_group });
            const profileEmails = matchedProfile.map((pro) => { return { name: pro.full_name, email: pro.email_address }; });
            console.log("Passed two");
            const notificationQueue = process.env.BLOOD_REQUEST_NOTIFICATION + "";
            const notificationService = new notification_service_1.default(notificationQueue);
            console.log("Passed three");
            yield notificationService._init_();
            notificationService.sendBloodRequest(profileEmails, blood_group, neededAt, locatedAt.hospital_name);
            console.log("Passed four");
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
                status: Enum_1.BloodDonorStatus.Open
            };
            console.log("Saved data");
            console.log(saveData);
            const saveDonorIntoDb = yield this.bloodDonorRepo.createDonor(saveData);
            console.log("Save donor db");
            console.log(saveDonorIntoDb);
            if (saveDonorIntoDb) {
                // const updateUser = await this.
                const tokenHelper = new tokenHelper_1.default();
                const authToken = yield tokenHelper.generateJWtToken({ blood_group: bloodGroup, donor_id: BloodDonorId, email_address: emailID, full_name: fullName, phone_number: phoneNumber }, Enum_1.JwtTimer._30Days);
                console.log("Proifle");
                console.log(authToken);
                return {
                    msg: "Blood profile created success",
                    status: true,
                    statusCode: Enum_1.StatusCode.CREATED,
                    data: {
                        donor_db_id: saveDonorIntoDb,
                        donor_id: BloodDonorId,
                        token: authToken
                    }
                };
            }
            else {
                return {
                    msg: "Blood profile creation failed",
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
