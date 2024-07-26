import { Request, Response } from 'express';
import { BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupFilter, BloodStatus, Relationship, StatusCode } from '../Util/Types/Enum';
import { CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import mongoose from 'mongoose';
import BloodService from '../service/bloodService';
import BloodDonorRepo from '../repo/bloodDonorRepo';
import { IBloodDonorTemplate, IUserBloodDonorEditable } from '../Util/Types/Interface/ModelInterface';
import { LocatedAt } from '../Util/Types/Types';

interface IUserController {
    createBloodDonation(req: Request, res: Response): Promise<void>
    updateBloodDonation(req: Request, res: Response): Promise<void>
    blood_request(req: CustomRequest, res: Response): Promise<void>
    blood_donate(req: CustomRequest, res: Response): Promise<void>
    findNearBy(req: Request, res: Response): Promise<void>
    bloodAvailability(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
    updateBloodDonor(req: Request, res: Response): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    findRequest(req: CustomRequest, res: Response): Promise<void>
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;
    private readonly bloodDonorRepo: BloodDonorRepo;

    constructor() {

        this.createBloodDonation = this.createBloodDonation.bind(this)
        this.bloodService = new BloodService();
        this.bloodDonorRepo = new BloodDonorRepo()
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

    async updateBloodGroup(req: CustomRequest, res: Response): Promise<void> {
        const donor_id: string = req.context?.donor_id;
        const newGroup: BloodGroup = req.body?.blood_group;
        const certificateName: string = req.body?.certificate_name;

        const submiteRequest: HelperFunctionResponse = await this.bloodService.updateBloodGroupRequest(newGroup, donor_id, certificateName);
        res.status(submiteRequest.statusCode).json({ status: submiteRequest.status, msg: submiteRequest.msg })
    }

    async updateBloodDonor(req: Request, res: Response): Promise<void> {

        const bodyData: IUserBloodDonorEditable = req.body;
        const editId: string = req.params.edit_id;
        let editableBloodDonors: IUserBloodDonorEditable = {
            email_address: bodyData.email_address,
            full_name: bodyData.full_name,
            locatedAt: bodyData.locatedAt,
            phoneNumber: bodyData.phoneNumber
        };

        const updateDonor: HelperFunctionResponse = await this.bloodService.updateBloodDonors(editableBloodDonors, editId);
        res.status(updateDonor.statusCode).json({
            status: updateDonor.status,
            msg: updateDonor.msg
        })
    }




    async getSingleProfile(req: Request, res: Response): Promise<void> {
        const profile_id: string = req.body.profile_id;
        const profile: IBloodDonorTemplate | null = await this.bloodDonorRepo.findBloodDonorByDonorId(profile_id);
        if (profile) {
            res.status(StatusCode.OK).json({ status: true, msg: "Profile fetched success", profile })
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Invalid or wrong profile id" })
        }
    }


    async createBloodDonation(req: Request, res: Response) {

        console.log(req.body);
        const fullName: string = req.body.full_name;
        const emailID: string = req.body.email_address
        const phoneNumber: number = req.body.phone_number;
        const bloodGroup: BloodGroup = req.body.bloodGroup;
        const location: string = req.body.location;

        console.log(this);

        const createBloodDonor: HelperFunctionResponse = await this.bloodService.bloodDonation(fullName, emailID, phoneNumber, bloodGroup, location);
        res.status(createBloodDonor.statusCode).json({
            status: createBloodDonor.status,
            msg: createBloodDonor.msg,
            data: createBloodDonor.data
        })
    }

    async updateBloodDonation(req: Request, res: Response) { }

    async findNearBy(req: Request, res: Response) { }

    async bloodAvailability(req: Request, res: Response) {

        const bloodGroup: BloodGroup = req.params.blood_group as BloodGroup;
        const status: BloodDonorStatus = req.params.status as BloodDonorStatus;
        const findBloodDonors = await this.bloodService.findBloodAvailability(status, bloodGroup);
        res.status(findBloodDonors.statusCode).json({ status: findBloodDonors.status, data: findBloodDonors.data, msg: findBloodDonors.status })

    }

    async blood_request(req: CustomRequest, res: Response) {

        const context = req.context;
        if (context) {

            const patientName: string = req.body.name;
            const unit: number = req.body.unit;
            const neededAt: Date = req.body.needed_at;
            const status = BloodStatus.Pending;
            const user_id: mongoose.Types.ObjectId = context.user_id;
            const profile_id: string = context?.profile_id;
            const blood_group: BloodGroup = req.body.blood_group;
            const relationship: Relationship = req.body.relationship;
            const locatedAt: LocatedAt = req.body.locatedAt;
            const address: string = req.body.address;
            const phoneNumber: number = req.body.phone_number;

            const createdBloodRequest: HelperFunctionResponse = await this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber);
            res.status(createdBloodRequest.statusCode).json({
                status: createdBloodRequest.status,
                msg: createdBloodRequest.msg,
                data: createdBloodRequest.data
            })
        } else {
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