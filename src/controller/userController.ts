import { Request, Response } from 'express';
import { BloodGroup, BloodStatus, LocatedAt, Relationship, StatusCode } from '../Util/Types/Enum';
import { CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import mongoose from 'mongoose';
import BloodService from '../service/bloodService';
import BloodDonorRepo from '../repo/bloodDonorRepo';
import { IBloodDonorTemplate } from '../Util/Types/Interface/ModelInterface';

interface IUserController {
    createBloodDonation(req: Request, res: Response): Promise<void>
    updateBloodDonation(req: Request, res: Response): Promise<void>
    blood_request(req: CustomRequest, res: Response): Promise<void>
    blood_donate(req: CustomRequest, res: Response): Promise<void>
    findNearBy(req: Request, res: Response): Promise<void>
    bloodAvailability(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    getSingleProfile(req: Request, res: Response): Promise<void>
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;
    private readonly bloodDonorRepo: BloodDonorRepo;

    constructor() {

        this.createBloodDonation = this.createBloodDonation.bind(this)
        this.bloodService = new BloodService();
        this.bloodDonorRepo = new BloodDonorRepo()
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

    async bloodAvailability(req: Request, res: Response) { }

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
            const user_id = context.user_id;
            const profile_id = context.profile_id;
            const donation_id = req.params.donation_id;




        }
    }




}

export default UserController