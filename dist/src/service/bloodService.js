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
const ProfileChatApiCommunication_1 = __importDefault(require("../communication/ApiCommunication/ProfileChatApiCommunication"));
class BloodService {
    // private readonly chatService: ChatService
    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.createBloodId = this.createBloodId.bind(this);
        this.bloodDonation = this.bloodDonation.bind(this);
        this.createDonorId = this.createDonorId.bind(this);
        this.closeRequest = this.closeRequest.bind(this);
        this.createBloodRequirement = this.createBloodRequirement.bind(this);
        this.findMyIntrest = this.findMyIntrest.bind(this);
        this.updateRequestStatus = this.updateRequestStatus.bind(this);
        this.donationHistory = this.donationHistory.bind(this);
        this.findNearestBloodDonors = this.findNearestBloodDonors.bind(this);
        this.bloodReqRepo = new bloodReqRepo_1.default();
        this.bloodDonorRepo = new bloodDonorRepo_1.default();
        this.bloodGroupUpdateRepo = new bloodGroupUpdate_1.default();
        this.bloodDonationRepo = new bloodDonation_1.default();
        this.utilHelper = new UtilHelpers_1.default();
        // this.chatService = new ChatService();
    }
    findNearestBloodDonors(page, limit, location) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const find = yield this.bloodDonorRepo.nearBySearch(location, limit, skip);
            if (find.total_records) {
                return {
                    status: true,
                    msg: "Donors found",
                    statusCode: Enum_1.StatusCode.OK
                };
            }
            else {
                return {
                    status: false,
                    msg: "No data found",
                    statusCode: Enum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    advanceBloodBankSearch(page, limit, blood_group, urgency, hospital) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            if (blood_group) {
                filter['blood_group'] = blood_group;
            }
            const date = new Date();
            const maxDate = date.setDate(date.getDate() + 1);
            if (urgency) {
                filter['neededAt'] = {
                    $lte: maxDate
                };
            }
            if (hospital) {
                filter['locatedAt.hospital_id'] = hospital;
            }
            const skip = (page - 1) * limit;
            const findData = yield this.bloodReqRepo.advanceFilter(filter, limit, skip);
            if (findData.paginated) {
                return {
                    status: true,
                    msg: "Found result",
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
    findDonorProfile(donor_id, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
                const findDonatedHistory = (yield this.bloodDonationRepo.findMyDonation(donor_id, 0, 1)).total_records;
                const bloodRequirement = (yield this.bloodReqRepo.findUserRequirement(profile_id)).length;
                const expressedIntrest = (yield this.bloodDonationRepo.findMyIntrest(donor_id, 0, 10)).total_records;
                const matchedProfile = profile ? (yield this.bloodReqRepo.findActiveBloodReq(profile.blood_group)).length : 0;
                if (profile) {
                    const profileCard = {
                        profile,
                        blood_group: profile === null || profile === void 0 ? void 0 : profile.blood_group,
                        donated_blood: findDonatedHistory,
                        blood_requirements: bloodRequirement,
                        expressed_intrest: expressedIntrest,
                        status: profile === null || profile === void 0 ? void 0 : profile.status,
                        matched_profile: matchedProfile
                    };
                    return {
                        status: true,
                        msg: "Profile fetch success",
                        statusCode: Enum_1.StatusCode.OK,
                        data: {
                            profile: profileCard
                        }
                    };
                }
                else {
                    console.log("Profile not found");
                    return {
                        status: false,
                        msg: "̉No profile found",
                        statusCode: Enum_1.StatusCode.BAD_REQUEST,
                    };
                }
            }
            catch (e) {
                console.log(e);
                return {
                    msg: "Profile fetching failed",
                    status: false,
                    statusCode: Enum_1.StatusCode.BAD_REQUEST
                };
            }
        });
    }
    donationHistory(donor_id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const findHistory = yield this.bloodDonationRepo.findMyDonation(donor_id, skip, limit);
            if (findHistory.total_records) {
                return {
                    status: true,
                    msg: "History fetched",
                    statusCode: Enum_1.StatusCode.OK,
                    data: findHistory
                };
            }
            else {
                return {
                    status: false,
                    msg: "No history found",
                    statusCode: Enum_1.StatusCode.NOT_FOUND,
                };
            }
        });
    }
    updateRequestStatus(request_id, status, profile_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRequest = yield this.bloodDonationRepo.findDonationById(request_id);
                if (findRequest) {
                    if (findRequest.status == Enum_1.BloodDonationStatus.Approved) {
                        return {
                            status: false,
                            msg: "Its already approved",
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                    else if (findRequest.status == status) {
                        return {
                            status: false,
                            msg: "Please update with new status",
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                    else {
                        const updateRequest = yield this.bloodDonationRepo.updateStatus(request_id, status);
                        if (updateRequest) {
                            return {
                                status: true,
                                msg: "Status has been updated",
                                statusCode: Enum_1.StatusCode.OK
                            };
                        }
                        else {
                            return {
                                status: false,
                                msg: "Something went wrong",
                                statusCode: Enum_1.StatusCode.BAD_REQUEST
                            };
                        }
                    }
                }
                else {
                    return {
                        status: false,
                        msg: "Invalid request",
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
            }
            catch (e) {
                return {
                    status: false,
                    msg: "Internal server error",
                    statusCode: Enum_1.StatusCode.SERVER_ERROR
                };
            }
        });
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
    findMyIntrest(donor_id, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const myIntrest = yield this.bloodDonationRepo.findMyIntrest(donor_id, skip, limit); //this.bloodReqRepo.findMyIntrest(donor_id);
            if (myIntrest.total_records) {
                return {
                    status: true,
                    msg: "Fetched all intrest",
                    data: myIntrest,
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
    showIntrest(auth_token, profile_id, donor_id, request_id, concerns, date) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const findRequirement = yield this.bloodReqRepo.findBloodRequirementByBloodId(request_id);
            const findExistance = yield this.bloodDonationRepo.findExistanceOfDonation(donor_id, request_id);
            if (findExistance) {
                return {
                    status: false,
                    msg: "You have already showed intrest for this donation",
                    statusCode: Enum_1.StatusCode.BAD_REQUEST,
                };
            }
            if (findRequirement) {
                const findDonor = yield this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
                if ((findDonor === null || findDonor === void 0 ? void 0 : findDonor.status) == Enum_1.BloodDonorStatus.Open) {
                    if (findRequirement.neededAt < date) {
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
                        donor_id,
                        status: Enum_1.BloodDonationStatus.Pending
                    };
                    let concernsMessage = [];
                    if (concerns.seriousConditions.length) {
                        concernsMessage.push(`I have serious conditions such as ${concerns.seriousConditions.join(", ")}`);
                    }
                    if (concerns.majorSurgeryOrIllness) {
                        concernsMessage.push(`I had major surgery on ${concerns.majorSurgeryOrIllness}`);
                    }
                    if (concerns.tobaco_use) {
                        concernsMessage.push(`I use tobacco`);
                    }
                    if (concerns.chronicIllnesses) {
                        concernsMessage.push(`I have chronic illnesses like diabetes or hypertension`);
                    }
                    const concernsChat = concernsMessage.length
                        ? `Please consider that I have the following concerns: ${concernsMessage.join(", ")}.`
                        : '';
                    const msg = `Hi ${findRequirement.patientName}, ${concernsChat} I would like to donate my blood to you. I'll come to ${findRequirement.locatedAt.hospital_name} by ${date}.Please let me know if there’s anything else I should be aware of.`;
                    console.log(`To profile id ${findRequirement.profile_id}`);
                    const newInterest = yield this.bloodDonationRepo.saveDonation(bloodDonationData);
                    console.log(newInterest);
                    if (newInterest) {
                        const bloodNotification = {
                            msg,
                            subject: `${findDonor.full_name} ready to donate blood for ${findRequirement.patientName}`,
                            email_id: findRequirement.email_id,
                            from_name: findDonor.full_name,
                            reciver_name: findRequirement.patientName
                        };
                        const profileCommunication = new ProfileChatApiCommunication_1.default();
                        const communicationProvide = new notification_service_1.default(process.env.PROFILE_CHAT_UPDATE || "");
                        profileCommunication.createChatRoom(msg, findRequirement.profile_id, auth_token);
                        yield communicationProvide._init_();
                        communicationProvide.transferData(bloodNotification);
                        return {
                            status: true,
                            msg: "You have showed intrested on this request",
                            statusCode: Enum_1.StatusCode.OK
                        };
                    }
                    else {
                        return {
                            status: false,
                            msg: "You've already shown interest in this.",
                            statusCode: Enum_1.StatusCode.BAD_REQUEST
                        };
                    }
                }
                else if ((findDonor === null || findDonor === void 0 ? void 0 : findDonor.status) == Enum_1.BloodDonorStatus.Blocked) {
                    const blockedReason = (_a = findDonor.blocked_reason) !== null && _a !== void 0 ? _a : Enum_1.DonorAccountBlockedReason.AlreadyDonated;
                    return {
                        status: true,
                        msg: blockedReason,
                        statusCode: Enum_1.StatusCode.BAD_REQUEST
                    };
                }
                else {
                    return {
                        status: false,
                        msg: Enum_1.DonorAccountBlockedReason.AccountDeleted,
                        statusCode: Enum_1.StatusCode.UNAUTHORIZED
                    };
                }
            }
            else {
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
            console.log("Donors");
            console.log(findDonors);
            if (findDonors.length) {
                for (let index = 0; index < findDonors.length; index++) {
                    if (result[findDonors[index].blood_group] != null) {
                        result[findDonors[index].blood_group]++;
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
    createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, email_address) {
        return __awaiter(this, void 0, void 0, function* () {
            const blood_id = yield this.createBloodId(blood_group, unit);
            console.log("The location is ");
            console.log(locatedAt);
            const createdBloodRequest = yield this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, false, email_address);
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
