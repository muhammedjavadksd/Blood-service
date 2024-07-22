import { Request, Response } from 'express';
import { BloodGroup, BloodStatus, LocatedAt, Relationship, StatusCode } from '../Util/Types/Enum';
import { CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import mongoose from 'mongoose';
import BloodService from '../service/bloodService';

interface IUserController {
    createBloodDonation(req: Request, res: Response): Promise<void>
    updateBloodDonation(req: Request, res: Response): Promise<void>
    blood_request(req: CustomRequest, res: Response): Promise<void>
    blood_donate(req: CustomRequest, res: Response): Promise<void>
    findNearBy(req: Request, res: Response): Promise<void>
    bloodAvailability(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;

    constructor() {
        this.bloodService = new BloodService();
    }


    async createBloodDonation(req: Request, res: Response) {

        const fullName: string = req.body.full_name;
        const emailID: string = req.body.email_address
        const phoneNumber: number = req.body.phone_number;
        const bloodGroup: string = req.body.bloodGroup;
        const location: string = req.body.location;


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

    async closeRequest(req: Request, res: Response): Promise<void> { }

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