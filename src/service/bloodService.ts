import mongoose, { ObjectId } from "mongoose";
import { BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodGroupUpdateStatus, BloodStatus, DonorAccountBlockedReason, JwtTimer, Relationship, StatusCode } from "../Util/Types/Enum";
import { BloodDonationConcerns, BloodDonationInterestData, BloodDonationValidationResult, HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { IBloodAvailabilityResult, LocatedAt, mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodReqRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import IBloodRequirement, { IBloodDonateTemplate, IBloodDonor, IBloodDonorTemplate, IBloodGroupUpdateTemplate, IBloodRequirementTemplate, IEditableBloodRequirementTemplate, IEditableGroupGroupRequest, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorRepo from "../repo/bloodDonorRepo";
import BloodGroupUpdateRepo from "../repo/bloodGroupUpdate";
import BloodDonationRepo from "../repo/bloodDonation";
import TokenHelper from "../Util/Helpers/tokenHelper";
import e from "express";
import BloodNotificationProvider from "../communication/Provider/notification_service";

interface IBloodService {
    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse>
    createBloodId(blood_group: BloodGroup, unit: number): Promise<string>
    bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: string): Promise<HelperFunctionResponse>
    createDonorId(blood_group: BloodGroup, fullName: string): Promise<string>
    closeRequest(blood_group: BloodGroup): Promise<HelperFunctionResponse>
    updateBloodDonors(editData: IUserBloodDonorEditable, edit_id: string): Promise<HelperFunctionResponse>
    updateBloodGroupRequest(newGroup: string, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse>
    updateBloodGroupRequest(newGroup: string, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse>
    updateBloodGroup(request_id: ObjectId, newStatus: BloodGroupUpdateStatus): Promise<HelperFunctionResponse>
    findBloodGroupChangeRequets(status: BloodGroupUpdateStatus, page: number, limit: number, perPage: number): Promise<HelperFunctionResponse>
    findBloodAvailability(status: BloodDonorStatus, blood_group: BloodGroup): Promise<HelperFunctionResponse>
    // donateBlood(donor_id: string, donation_id: string, status: BloodDonationStatus): Promise<HelperFunctionResponse>
    findRequest(donor_id: string): Promise<HelperFunctionResponse>
    findActivePaginatedBloodRequirements(page: number, limit: number): Promise<HelperFunctionResponse>
    showIntrest(donor_id: string, request_id: string, concers: BloodDonationConcerns, date: Date): Promise<HelperFunctionResponse>
    findMyIntrest(donor_id: string): Promise<HelperFunctionResponse>
    findMyRequest(profile_id: string): Promise<HelperFunctionResponse>
}

class BloodService implements IBloodService {

    private readonly bloodReqRepo: BloodRepo;
    private readonly bloodDonorRepo: BloodDonorRepo;
    private readonly bloodGroupUpdateRepo: BloodGroupUpdateRepo;
    private readonly bloodDonationRepo: BloodDonationRepo;
    private readonly utilHelper: UtilHelper;



    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.createBloodId = this.createBloodId.bind(this)
        this.bloodDonation = this.bloodDonation.bind(this)
        this.createDonorId = this.createDonorId.bind(this)
        this.closeRequest = this.closeRequest.bind(this)
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.findMyIntrest = this.findMyIntrest.bind(this)
        this.bloodReqRepo = new BloodRepo();
        this.bloodDonorRepo = new BloodDonorRepo();
        this.bloodGroupUpdateRepo = new BloodGroupUpdateRepo();
        this.bloodDonationRepo = new BloodDonationRepo();
        this.utilHelper = new UtilHelper();
    }





    async findMyRequest(profile_id: string): Promise<HelperFunctionResponse> {
        const findRequest = await this.bloodReqRepo.findUserRequirement(profile_id);
        if (findRequest.length) {
            return {
                status: true,
                msg: "Fetch all profile",
                data: {
                    profile: findRequest
                },
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No profile found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }


    async findMyIntrest(donor_id: string): Promise<HelperFunctionResponse> {
        const myIntrest = await this.bloodReqRepo.findMyIntrest(donor_id);
        if (myIntrest.length) {
            return {
                status: true,
                msg: "Fetched all intrest",
                data: {
                    profile: myIntrest
                },
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }




    bloodDonationInterestValidation(data: BloodDonationInterestData) {
        const errors: string[] = [];
        const concerns: BloodDonationConcerns = {
            seriousConditions: [],
            majorSurgeryOrIllness: null,
            chronicIllnesses: false,
            tobaco_use: false
        };

        const {
            donatedLast90Days = true,
            weight = '',
            seriousConditions = [],
            majorSurgeryOrIllness = false,
            surgeryOrIllnessDetails = '',
            chronicIllnesses = '',
            tattooPiercingAcupuncture = '',
            alcoholConsumption = '',
            tobaccoUse = '',
            pregnancyStatus = '',
            date = new Date()
        } = data;

        if (!donatedLast90Days) {
            errors.push('Donation status for the last 90 days is required.');
        } else if (donatedLast90Days === true) {
            errors.push("You can't donate since you have already donated in the last 90 days.");
        }

        if (!weight) {
            errors.push('Weight is required.');
        } else if (isNaN(Number(weight)) || Number(weight) < 50) {
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
        } as BloodDonationValidationResult;
    }



    async showIntrest(donor_id: string, request_id: string, concerns: BloodDonationConcerns, date: Date): Promise<HelperFunctionResponse> {
        const findRequirement = await this.bloodReqRepo.findBloodRequirementByBloodId(request_id);
        const findExistance = await this.bloodDonationRepo.findExistanceOfDonation(donor_id, request_id);
        if (findExistance) {
            return {
                status: false,
                msg: "You have already showed intrest for this donation",
                statusCode: StatusCode.BAD_REQUEST,

            }
        }

        if (findRequirement) {
            const findDonor = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
            if (findDonor?.status == BloodDonorStatus.Open) {
                if (findRequirement.neededAt < date) {
                    return {
                        status: false,
                        msg: "The selected date is beyond the expected range.",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }

                const bloodDonationData: IBloodDonateTemplate = {
                    concerns,
                    date: new Date(),
                    meet_expect: date,
                    donation_id: request_id,
                    donor_id: donor_id,
                    status: BloodDonationStatus.Pending
                }

                const newIntrest = await this.bloodDonationRepo.saveDonation(bloodDonationData) //  await this.bloodReqRepo.addIntrest(donor_id, request_id);

                if (newIntrest) {
                    return {
                        status: true,
                        msg: "You have showed intrested on this request",
                        statusCode: StatusCode.OK
                    }
                } else {
                    return {
                        status: false,
                        msg: "You've already shown interest in this.",
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }
            } else if (findDonor?.status == BloodDonorStatus.Blocked) {
                const blockedReason = findDonor.blocked_reason ?? DonorAccountBlockedReason.AlreadyDonated
                return {
                    status: true,
                    msg: blockedReason,
                    statusCode: StatusCode.BAD_REQUEST
                }
            } else {
                return {
                    status: false,
                    msg: DonorAccountBlockedReason.AccountDeleted,
                    statusCode: StatusCode.UNAUTHORIZED
                }
            }
        } else {
            return {
                status: false,
                msg: "The patient no longer needs blood. Thank you.",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }


    async findActivePaginatedBloodRequirements(page: number, limit: number): Promise<HelperFunctionResponse> {
        const findReq = await this.bloodReqRepo.findActiveBloodReqPaginted(limit, (page - 1) * limit);
        if (findReq.length) {
            return {
                status: true,
                msg: "Request fetched",
                statusCode: StatusCode.OK,
                data: {
                    profile: findReq
                }
            }
        } else {
            return {
                status: false,
                msg: "No data found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async findRequest(donor_id: string): Promise<HelperFunctionResponse> {
        const findDonor = await this.bloodDonorRepo.findBloodDonorByDonorId(donor_id);
        if (findDonor) {
            const bloodGroup: BloodGroup = findDonor.blood_group;
            const request = await this.bloodReqRepo.findActiveBloodReq(bloodGroup);
            return {
                status: true,
                msg: "Request fetched",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "Unauthorized access.",
                statusCode: StatusCode.UNAUTHORIZED
            }
        }
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

    async findBloodAvailability(status: BloodDonorStatus, blood_group?: BloodGroup): Promise<HelperFunctionResponse> {
        const findBloodAvailabilityFilter: ISearchBloodDonorTemplate = {}
        let result: IBloodAvailabilityResult = {
            [BloodGroup.A_POSITIVE]: 0,
            [BloodGroup.A_NEGATIVE]: 0,
            [BloodGroup.B_POSITIVE]: 0,
            [BloodGroup.B_NEGATIVE]: 0,
            [BloodGroup.AB_POSITIVE]: 0,
            [BloodGroup.AB_NEGATIVE]: 0,
            [BloodGroup.O_POSITIVE]: 0,
            [BloodGroup.O_NEGATIVE]: 0,
        }
        if (status) {
            findBloodAvailabilityFilter.status = status
        }
        if (blood_group) {
            findBloodAvailabilityFilter.blood_group = blood_group
        }
        const findDonors = await this.bloodDonorRepo.findDonors(findBloodAvailabilityFilter);

        if (findDonors.length) {

            for (let index = 0; index < findDonors.length; index++) {


                if (result[findDonors[index].blood_group] != null) {
                    console.log(result[findDonors[index].blood_group]);
                } else {
                    result[findDonors[index].blood_group] = 0
                }
            }

            return {
                status: true,
                msg: "Data fetched success",
                statusCode: StatusCode.OK,
                data: result
            }
        } else {
            return {
                status: false,
                msg: "No donors found",
                statusCode: StatusCode.NOT_FOUND,
            }
        }
    }

    async updateBloodGroup(request_id: ObjectId, newStatus: BloodGroupUpdateStatus): Promise<HelperFunctionResponse> {
        const findBloodGroup = await this.bloodGroupUpdateRepo.findRequestById(request_id);
        if (findBloodGroup) {
            const updateData: IEditableGroupGroupRequest = {};

            if (findBloodGroup.status == BloodGroupUpdateStatus.Pending && newStatus == BloodGroupUpdateStatus.Completed) {
                updateData.new_group = findBloodGroup.new_group;
                updateData.status = BloodGroupUpdateStatus.Completed
            } else if (findBloodGroup.status == BloodGroupUpdateStatus.Pending && newStatus == BloodGroupUpdateStatus.Rejected) {
                updateData.status = BloodGroupUpdateStatus.Rejected
            } else {
                return {
                    msg: "Blood group update is not allowed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }

            const upateBloodGroup = await this.bloodGroupUpdateRepo.updateRequest(request_id, updateData)
            if (upateBloodGroup) {
                return {
                    msg: "Blood group updated success",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Blood group updated failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Blood group not found.",
                status: false,
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async findBloodGroupChangeRequets(status: BloodGroupUpdateStatus, page: number, limit: number, perPage: number): Promise<HelperFunctionResponse> {
        const findRequests = await this.bloodGroupUpdateRepo.findAllRequest(status, page, limit, perPage)
        if (findRequests.length) {
            return {
                status: true,
                msg: "Data fetched",
                data: {
                    requests: findRequests
                },
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "No request found",
                statusCode: StatusCode.NOT_FOUND
            }
        }
    }

    async updateBloodGroupRequest(newGroup: BloodGroup, profile_id: string, certificate_name: string): Promise<HelperFunctionResponse> {
        const findBloodId: IBloodDonor | null = await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
        console.log(findBloodId);

        if (findBloodId) {
            if (findBloodId.blood_group != newGroup) {
                const data: IBloodGroupUpdateTemplate = {
                    certificate: certificate_name,
                    date: new Date(),
                    donor_id: profile_id,
                    new_group: newGroup,
                    status: BloodGroupUpdateStatus.Pending
                }
                const saveData: ObjectId | null = await this.bloodGroupUpdateRepo.saveRequest(data)
                console.log(saveData);
                console.log("Saved data");


                if (saveData) {
                    return {
                        msg: "Update request has been sent",
                        status: true,
                        statusCode: StatusCode.CREATED
                    }
                } else {
                    return {
                        msg: "The update request failed",
                        status: false,
                        statusCode: StatusCode.BAD_REQUEST
                    }
                }
            } else {
                return {
                    msg: "The new blood group is the same as the current blood group.",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "We couldn't find the blood profile.",
                status: false,
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async updateBloodDonors(editData: IUserBloodDonorEditable, edit_id: string): Promise<HelperFunctionResponse> {
        const updateDonor = await this.bloodDonorRepo.updateBloodDonor(editData, edit_id);
        console.log(updateDonor);
        console.log(edit_id, editData);


        if (updateDonor) {
            return {
                status: true,
                msg: "Donor updated success",
                statusCode: StatusCode.OK
            }
        } else {
            return {
                status: false,
                msg: "Donor updation failed",
                statusCode: StatusCode.BAD_REQUEST
            }
        }
    }

    async createDonorId(blood_group: BloodGroup, fullName: string): Promise<string> {
        let blood_id: string = fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5) + blood_group;
        let isDonorExist: IBloodDonor | null = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        while (isDonorExist) {
            blood_id = blood_group + fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5);
            isDonorExist = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        }
        return blood_id
    }


    async createBloodId(blood_group: BloodGroup, unit: number): Promise<string> {
        let blood_id: string = blood_group + unit + this.utilHelper.createRandomText(5);
        let isUserExist: IBloodRequirement | null = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        while (isUserExist) {
            blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
            isUserExist = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        }
        return blood_id
    }


    async createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse> {
        const blood_id: string = await this.createBloodId(blood_group, unit)
        const createdBloodRequest: mongoObjectId | null = await this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, false)
        // const notification =
        //     console.log(createdBloodRequest);

        console.log("Passed one");


        const matchedProfile = await this.bloodDonorRepo.findDonors({ status: BloodDonorStatus.Open, blood_group: blood_group });
        const profileEmails = matchedProfile.map((pro) => { return { name: pro.full_name, email: pro.email_address } })

        console.log("Passed two");
        const notificationQueue: string = process.env.BLOOD_REQUEST_NOTIFICATION + "";
        const notificationService = new BloodNotificationProvider(notificationQueue)
        console.log("Passed three");
        await notificationService._init_();
        notificationService.sendBloodRequest(profileEmails, blood_group, neededAt, locatedAt.hospital_name)
        console.log("Passed four");

        if (createdBloodRequest) {
            return {
                msg: "Blood requirement created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    blood_id: blood_id,
                    id: createdBloodRequest
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }

    async bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: string): Promise<HelperFunctionResponse> {

        const BloodDonorId: string = await this.createDonorId(bloodGroup, fullName);
        const saveData: IBloodDonorTemplate = {
            blood_group: bloodGroup,
            donor_id: BloodDonorId,
            email_address: emailID,
            full_name: fullName,
            locatedAt: location,
            phoneNumber: phoneNumber,
            status: BloodDonorStatus.Open
        };


        console.log("Saved data");
        console.log(saveData);



        const saveDonorIntoDb: ObjectId | null = await this.bloodDonorRepo.createDonor(saveData);
        console.log("Save donor db");

        console.log(saveDonorIntoDb);

        if (saveDonorIntoDb) {
            // const updateUser = await this.
            const tokenHelper = new TokenHelper();
            const authToken = await tokenHelper.generateJWtToken({ blood_group: bloodGroup, donor_id: BloodDonorId, email_address: emailID, full_name: fullName, phone_number: phoneNumber }, JwtTimer._30Days)
            console.log("Proifle");
            console.log(authToken);


            return {
                msg: "Blood profile created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    donor_db_id: saveDonorIntoDb,
                    donor_id: BloodDonorId,
                    token: authToken
                }
            }
        } else {
            return {
                msg: "Blood profile creation failed",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async closeRequest(blood_id: string): Promise<HelperFunctionResponse> {
        const bloodRequestion = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        if (bloodRequestion) {
            const updateData: boolean = await this.bloodReqRepo.updateBloodDonor(blood_id, {
                is_closed: true
            });
            if (updateData) {
                return {
                    msg: "Requirement closed",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Requirement closing failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }



}


export default BloodService