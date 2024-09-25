import { Request, Response } from 'express';
import { BloodCloseCategory, BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodStatus, DonorAccountBlockedReason, Relationship, S3BucketsNames, StatusCode } from '../Util/Types/Enum';
import { BloodDonationConcerns, CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import BloodService from '../service/bloodService';
import BloodDonorRepo from '../repo/bloodDonorRepo';
import { IBloodDonorTemplate, ILocatedAt, IUserBloodDonorEditable } from '../Util/Types/Interface/ModelInterface';
import { LocatedAt } from '../Util/Types/Types';
import ImageServices from '../service/ImageService';
import UtilHelper from '../Util/Helpers/UtilHelpers';
import BloodNotificationProvider from '../communication/Provider/notification_service';
import { ObjectId } from 'mongoose';
// import ChatService from '../service/chatService';

interface IUserController {
    createBloodDonation(req: Request, res: Response): Promise<void>
    updateBloodDonation(req: Request, res: Response): Promise<void>
    blood_request(req: CustomRequest, res: Response): Promise<void>
    // blood_donate(req: CustomRequest, res: Response): Promise<void>
    findBloodRequirement(req: Request, res: Response): Promise<void>
    bloodAvailability(req: Request, res: Response): Promise<void>
    bloodAvailabilityByStatitics(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    updateBloodDonor(req: Request, res: Response): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    findRequest(req: CustomRequest, res: Response): Promise<void>
    showIntresrest(req: CustomRequest, res: Response): Promise<void>
    findMyIntrest(req: CustomRequest, res: Response): Promise<void>
    myBloodRequest(req: CustomRequest, res: Response): Promise<void>
    updateAccountStatus(req: CustomRequest, res: Response): Promise<void>
    requestUpdate(req: CustomRequest, res: Response): Promise<void>
    findDonationHistory(req: CustomRequest, res: Response): Promise<void>
    advanceBloodRequirement(req: CustomRequest, res: Response): Promise<void>
    findNearestDonors(req: CustomRequest, res: Response): Promise<void>
    // getMyChats(req: CustomRequest, res: Response): Promise<void>
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;
    private readonly imageService: ImageServices;
    private readonly bloodDonorRepo: BloodDonorRepo;
    // private readonly chatService: ChatService;

    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this)
        this.updateBloodDonation = this.updateBloodDonation.bind(this)
        this.blood_request = this.blood_request.bind(this)
        // this.blood_donate = this.blood_donate.bind(this)
        this.findBloodRequirement = this.findBloodRequirement.bind(this)
        this.bloodAvailability = this.bloodAvailability.bind(this)
        this.bloodAvailabilityByStatitics = this.bloodAvailabilityByStatitics.bind(this)
        this.closeRequest = this.closeRequest.bind(this)
        this.getSingleProfile = this.getSingleProfile.bind(this)
        this.updateBloodDonor = this.updateBloodDonor.bind(this)
        this.updateBloodGroup = this.updateBloodGroup.bind(this)
        this.findRequest = this.findRequest.bind(this)
        this.createBloodDonation = this.createBloodDonation.bind(this)
        this.generatePresignedUrlForBloodGroupChange = this.generatePresignedUrlForBloodGroupChange.bind(this)
        this.showIntresrest = this.showIntresrest.bind(this)
        this.findMyIntrest = this.findMyIntrest.bind(this)
        this.myBloodRequest = this.myBloodRequest.bind(this)
        this.updateAccountStatus = this.updateAccountStatus.bind(this)
        this.requestUpdate = this.requestUpdate.bind(this)
        this.findDonationHistory = this.findDonationHistory.bind(this)
        this.findNearestDonors = this.findNearestDonors.bind(this)
        // this.getMyChats = this.getMyChats.bind(this)
        this.bloodService = new BloodService();
        this.bloodDonorRepo = new BloodDonorRepo()
        this.imageService = new ImageServices()
        // this.chatService = new ChatService()
    }


    async findNearestDonors(req: CustomRequest, res: Response): Promise<void> {


        const bloodGroup: BloodGroup = req.params.group as BloodGroup;
        const limit: number = +req.params.limit;
        const page: number = +req.params.page;
        const long: number = +(req.query.long || 0)
        const lati: number = +(req.query.lati || 0)
        const location: [number, number] = [long, lati]



        const findData = await this.bloodService.findNearestBloodDonors(page, limit, location, bloodGroup);
        res.status(findData.statusCode).json({ status: findData.status, msg: findData.msg, data: findData.data })
    }


    async advanceBloodRequirement(req: CustomRequest, res: Response): Promise<void> {
        // page/:limit/:blood_group/:urgency/:hospital
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;
        const blood_group: BloodGroup = req.params.blood_group as BloodGroup;
        const urgency: boolean = Boolean(req.params.urgency);
        const hospital: string = req.params.hospital;

        const find = await this.bloodService.advanceBloodBankSearch(page, limit, blood_group, urgency, hospital);
        res.status(find.statusCode).json({ status: find.status, msg: find.msg, data: find.data });
    }

    async findDonationHistory(req: CustomRequest, res: Response): Promise<void> {
        const page: number = +req.params.page
        const limit: number = +req.params.limit
        const donor_id: string = req.context?.donor_id;
        if (donor_id) {
            const findHistory = await this.bloodService.donationHistory(donor_id, limit, page);
            res.status(findHistory.statusCode).json({ status: findHistory.status, msg: findHistory.msg, data: findHistory.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access" })
        }
    }

    async requestUpdate(req: CustomRequest, res: Response): Promise<void> {

        const request_id: ObjectId = req.params.requirement_id as unknown as ObjectId;
        const status: BloodDonationStatus = req.body.status;
        const profile_id: string = req.context?.profile_id;
        const unit: number = req.body?.unit;

        if (profile_id) {
            const updateStatus: HelperFunctionResponse = await this.bloodService.updateRequestStatus(request_id, status, unit)
            res.status(updateStatus.statusCode).json({ status: updateStatus.status, msg: updateStatus.msg })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Un authraized access" })
        }
    }

    async updateAccountStatus(req: CustomRequest, res: Response): Promise<void> {
        console.log("Body");

        console.log(req.body);

        const status = req.body.status;
        const updateStatus: string = status == true ? "Open" : BloodDonorStatus.Blocked;
        const reason = status == true ? DonorAccountBlockedReason.UserHideAccount : ""
        const donor_id: string = req.context?.donor_id;
        let editableBloodDonors = {
            status: updateStatus,
            blocked_reason: reason
        };

        const updateDonor: HelperFunctionResponse = await this.bloodService.updateBloodDonors(editableBloodDonors, donor_id);
        console.log(updateDonor);

        res.status(updateDonor.statusCode).json({
            status: updateDonor.status,
            msg: updateDonor.msg
        })
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


    async myBloodRequest(req: CustomRequest, res: Response): Promise<void> {


        const profile_id = req.context?.profile_id;
        const limit = +req.params.limit;
        const page = +req.params.page;
        const status: BloodStatus = req.params.status as BloodStatus;

        if (profile_id) {
            const findProfile = await this.bloodService.findMyRequest(profile_id, page, limit, status);
            res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized Access", })
        }
    }


    async findMyIntrest(req: CustomRequest, res: Response): Promise<void> {
        const donorId = req?.context?.donor_id;
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;
        const status: BloodDonationStatus = req.params.status as BloodDonationStatus;

        if (donorId) {
            const findMyIntrest = await this.bloodService.findMyIntrest(donorId, limit, page, status);
            console.log(findMyIntrest);

            res.status(findMyIntrest.statusCode).json({ status: findMyIntrest.status, msg: findMyIntrest.msg, data: findMyIntrest.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized Access", })
        }
    }




    async showIntresrest(req: CustomRequest, res: Response): Promise<void> {
        const context = req.context;
        const req_id: string = req.params.request_id;
        const profile_id: string = context?.profile_id;
        const utilHelper = new UtilHelper()

        const token = utilHelper.getTokenFromHeader(req.headers['authorization'])
        if (profile_id && token) {

            const {
                donatedLast90Days = '',
                weight = '',
                seriousConditions = '',
                majorSurgeryOrIllness = '',
                surgeryOrIllnessDetails = '',
                chronicIllnesses = '',
                tattooPiercingAcupuncture = '',
                alcoholConsumption = '',
                tobaccoUse = '',
                pregnancyStatus = '',
                date = new Date()
            } = req.body;

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
            })
            if (validateDonorDetails.errors.length) {
                res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: validateDonorDetails.errors[0] })
                return;
            }
            let concerns: BloodDonationConcerns = validateDonorDetails.concerns;
            if (context) {
                const donor_id = context?.donor_id;
                const data = await this.bloodService.showIntrest(token, profile_id, donor_id, req_id, concerns, date)
                console.log(data);

                res.status(data.statusCode).json({ status: data.status, msg: data.msg })
            } else {
                res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
        }
    }



    async findRequest(req: CustomRequest, res: Response): Promise<void> {
        console.log("Reached here");

        if (req.context) {
            const profile_id = req.context?.profile_id;
            const blood_id = req.params?.request_id;
            const status: BloodDonationStatus = req.params?.status as BloodDonationStatus;
            const page: number = +req.params?.page;
            const limit: number = +req.params?.limit;

            const findCases: HelperFunctionResponse = await this.bloodService.findRequest(profile_id, blood_id, page, limit, status);
            res.status(findCases.statusCode).json({ status: findCases.status, msg: findCases.msg, data: findCases.data })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
        }
    }

    async generatePresignedUrlForBloodGroupChange(req: CustomRequest, res: Response): Promise<void> {
        const createdPresignedUrl = await this.imageService.generatePresignedUrlForChangeBloodGroupCertificat()
        res.status(createdPresignedUrl.statusCode).json({ status: true, msg: createdPresignedUrl.msg, data: createdPresignedUrl.data })
    }

    async updateBloodGroup(req: CustomRequest, res: Response): Promise<void> {
        const utilHelper = new UtilHelper();
        const donor_id: string = req.context?.donor_id;
        const newGroup: BloodGroup = req.body?.blood_group;
        const certificateName: string = req.body?.presigned_url;
        const certificate_name_from_presigned_url: string | boolean = `${S3BucketsNames.bloodCertificate}/${utilHelper.extractImageNameFromPresignedUrl(certificateName)}`;

        console.log(req.body);
        console.log(certificate_name_from_presigned_url);
        console.log(req.context);



        if (certificate_name_from_presigned_url) {
            const submiteRequest: HelperFunctionResponse = await this.bloodService.updateBloodGroupRequest(newGroup, donor_id, certificate_name_from_presigned_url);
            res.status(submiteRequest.statusCode).json({ status: submiteRequest.status, msg: submiteRequest.msg })
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Image not found" })
        }
    }

    async updateBloodDonor(req: CustomRequest, res: Response): Promise<void> {

        const bodyData: IUserBloodDonorEditable = req.body;
        const donor_id: string = req.context?.donor_id;
        let editableBloodDonors: IUserBloodDonorEditable = {
            email_address: bodyData.email_address,
            full_name: bodyData.full_name,
            locatedAt: bodyData.locatedAt,
            phoneNumber: bodyData.phoneNumber
        };

        console.log("Editing details");
        console.log(editableBloodDonors);


        const updateDonor: HelperFunctionResponse = await this.bloodService.updateBloodDonors(editableBloodDonors, donor_id);
        res.status(updateDonor.statusCode).json({
            status: updateDonor.status,
            msg: updateDonor.msg
        })
    }




    async getSingleProfile(req: CustomRequest, res: Response): Promise<void> {
        const donor_id: string = req.context?.donor_id;
        const profile_id: string = req.context?.profile_id;

        console.log("Profiles");
        console.log(donor_id, profile_id);

        console.log("Enterd 11111");


        if (profile_id && donor_id) {
            const profile: HelperFunctionResponse = await this.bloodService.findDonorProfile(donor_id, profile_id)  //await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
            console.log(profile);

            res.status(profile.statusCode).json({ status: profile.status, msg: profile.msg, data: profile.data })
        } else {
            console.log("This worked");
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Invalid or wrong profile id" })
        }
    }

    async createBloodDonation(req: Request, res: Response) {

        console.log("Body data");

        console.log(req.body);
        const fullName: string = req.body.full_name;
        const emailID: string = req.body.email_address
        const phoneNumber: number = req.body.phone_number;
        const bloodGroup: BloodGroup = req.body.bloodGroup;
        const locationBody = req.body.location;
        const location: ILocatedAt = {
            coordinates: [+locationBody.longitude || 0, locationBody?.latitude || 0],
            type: "Point"
        }

        const createBloodDonor: HelperFunctionResponse = await this.bloodService.bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location);
        res.status(createBloodDonor.statusCode).json({
            status: createBloodDonor.status,
            msg: createBloodDonor.msg,
            data: createBloodDonor.data
        })
    }

    async updateBloodDonation(req: Request, res: Response) { }

    async findBloodRequirement(req: Request, res: Response) {
        const page: number = +req.params.page;
        const limit: number = +req.params.limit;

        const findReq: HelperFunctionResponse = await this.bloodService.findActivePaginatedBloodRequirements(page, limit);
        console.log(findReq);

        res.status(findReq.statusCode).json({
            status: findReq.status,
            msg: findReq.msg,
            data: findReq.data
        })
    }

    async bloodAvailability(req: Request, res: Response) {

        const bloodGroup: BloodGroup = req.params.blood_group as BloodGroup;
        const status: BloodDonorStatus = req.params.status as BloodDonorStatus;
        const findBloodDonors = await this.bloodService.findBloodAvailability(status, bloodGroup);
        res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status })
    }

    async bloodAvailabilityByStatitics(req: Request, res: Response): Promise<void> {
        const findBloodDonors = await this.bloodService.findBloodAvailability(BloodDonorStatus.Open);
        res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status })
    }

    async blood_request(req: CustomRequest, res: Response) {

        const context = req.context;
        const requestData = req.body;
        console.log("Context");
        console.log(context);


        if (context) {

            console.log(requestData.enquired_with_others);

            if (!requestData.enquired_with_others) {
                res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please ask your neighbors, friends, and relatives for blood donors first.This can provide a quicker response and helps save blood for others in need" })
                return;
            }

            console.log("Request data");

            console.log(requestData);

            const patientName: string = requestData.patientName;
            const unit: number = requestData.unit;
            const neededAt: Date = requestData.neededAt;
            const status = BloodStatus.Pending;
            const blood_group: BloodGroup = requestData.blood_group;
            const relationship: Relationship = req.body.relationship;
            const locatedAt: LocatedAt = req.body.locatedAt;
            const address: string = req.body.address;
            const phoneNumber: number = req.body.phoneNumber;
            const email_address: string = req.body.email_address;
            const user_id = req.context?.user_id;
            const profile_id = req.context?.profile_id;

            const createdBloodRequest: HelperFunctionResponse = await this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, email_address);



            console.log("Worked this");

            res.status(createdBloodRequest.statusCode).json({
                status: createdBloodRequest.status,
                msg: createdBloodRequest.msg,
                data: createdBloodRequest.data
            })
        } else {
            console.log("This workeds");

            res.status(StatusCode.SERVER_ERROR).json({
                status: false,
                msg: "Internal server error",
            })
        }
    }

    async closeRequest(req: CustomRequest, res: Response): Promise<void> {
        const bloodReqId: string = req.params.blood_id;
        const category: BloodCloseCategory = req.body.category;
        const explanation: string = req.body.explanation;
        const user_id = req.context?.user_id;

        if (user_id) {
            const closeRequest = await this.bloodService.closeRequest(bloodReqId, category, explanation);
            res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.msg })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "User not found" })
        }
    }

    // async blood_donate(req: CustomRequest, res: Response) {
    //     const context = req.context;
    //     if (context) {
    //         const donor_id: string = context.donor_id;
    //         const donation_id: string = req.params.donation_id;
    //         const status: BloodDonationStatus = req.params.status as BloodDonationStatus;

    //         const donateBlood = await this.bloodService.donateBlood(donor_id, donation_id, status);
    //         res.status(donateBlood.statusCode).json({ status: donateBlood.status, msg: donateBlood.msg })
    //     } else {
    //         res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
    //     }
    // }

}

export default UserController