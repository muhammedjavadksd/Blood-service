import { Request, Response } from 'express';
import { BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodStatus, Relationship, S3BucketsNames, StatusCode } from '../Util/Types/Enum';
import { CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import BloodService from '../service/bloodService';
import BloodDonorRepo from '../repo/bloodDonorRepo';
import { IBloodDonorTemplate, IUserBloodDonorEditable } from '../Util/Types/Interface/ModelInterface';
import { LocatedAt } from '../Util/Types/Types';
import ImageServices from '../service/ImageService';
import UtilHelper from '../Util/Helpers/UtilHelpers';

interface IUserController {
    createBloodDonation(req: Request, res: Response): Promise<void>
    updateBloodDonation(req: Request, res: Response): Promise<void>
    blood_request(req: CustomRequest, res: Response): Promise<void>
    blood_donate(req: CustomRequest, res: Response): Promise<void>
    findBloodRequirement(req: Request, res: Response): Promise<void>
    bloodAvailability(req: Request, res: Response): Promise<void>
    bloodAvailabilityByStatitics(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    updateBloodDonor(req: Request, res: Response): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    findRequest(req: CustomRequest, res: Response): Promise<void>
    showIntresrest(req: CustomRequest, res: Response): Promise<void>
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;
    private readonly imageService: ImageServices;
    private readonly bloodDonorRepo: BloodDonorRepo;

    constructor() {
        this.createBloodDonation = this.createBloodDonation.bind(this)
        this.updateBloodDonation = this.updateBloodDonation.bind(this)
        this.blood_request = this.blood_request.bind(this)
        this.blood_donate = this.blood_donate.bind(this)
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
        this.bloodService = new BloodService();
        this.bloodDonorRepo = new BloodDonorRepo()
        this.imageService = new ImageServices()
    }




    async showIntresrest(req: CustomRequest, res: Response): Promise<void> {
        const contex = req.context;
        const req_id: string = req.params.request_id;
        console.log(req.params);

        if (contex) {
            const donor_id = req.context?.donor_id;
            this.bloodService.showIntrest(donor_id, req_id).then((data) => {
                res.status(data.statusCode).json({ status: data.status, msg: data.msg })
            }).catch((err) => {
                res.status(StatusCode.SERVER_ERROR).json({ status: false, msg: "Something went wrong" })
            })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
        }
    }




    async findRequest(req: CustomRequest, res: Response): Promise<void> {
        if (req.context) {
            const donor_id = req.context?.donor_id;
            const findCases: HelperFunctionResponse = await this.bloodService.findRequest(donor_id);
            res.status(findCases.statusCode).json({ status: findCases.status, msg: findCases.msg })
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
        const profile_id: string = req.context?.donor_id;
        if (profile_id) {
            const profile: IBloodDonorTemplate | null = await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
            console.log(profile_id);
            if (profile) {
                res.status(StatusCode.OK).json({ status: true, msg: "Profile fetched success", profile })
            } else {
                res.status(StatusCode.NOT_FOUND).json({ status: false, msg: "Invalid or wrong profile id" })
            }
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Invalid or wrong profile id" })
        }

    }




    async createBloodDonation(req: Request, res: Response) {

        console.log(req.body);
        const fullName: string = req.body.full_name;
        const emailID: string = req.body.email_address
        const phoneNumber: number = req.body.phone_number;
        const bloodGroup: BloodGroup = req.body.bloodGroup;
        const location: string = req.body.location;

        // console.log(this);

        const createBloodDonor: HelperFunctionResponse = await this.bloodService.bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location);

        console.log("Blood donor created");

        console.log(createBloodDonor);

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
            const user_id = req.context?.user_id;
            const profile_id = req.context?.profile_id;

            const createdBloodRequest: HelperFunctionResponse = await this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber);
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
        const bloodReqId: string = req.body.blood_req_id;
        const user_id = req.context?.user_id;

        if (user_id) {
            const closeRequest = await this.bloodService.closeRequest(bloodReqId);
            res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.status })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "User not found" })
        }
    }

    async blood_donate(req: CustomRequest, res: Response) {
        const context = req.context;
        if (context) {
            const donor_id: string = context.donor_id;
            const donation_id: string = req.params.donation_id;
            const status: BloodDonationStatus = req.params.status as BloodDonationStatus;

            const donateBlood = await this.bloodService.donateBlood(donor_id, donation_id, status);
            res.status(donateBlood.statusCode).json({ status: donateBlood.status, msg: donateBlood.msg })
        } else {
            res.status(StatusCode.UNAUTHORIZED).json({ status: false, msg: "Unauthorized access" })
        }
    }

}

export default UserController