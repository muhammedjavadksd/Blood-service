import { Response } from 'express';
import { BloodGroup, BloodStatus, LocatedAt, Relationship, StatusCode } from '../Util/Types/Enum';
import { CustomRequest, HelperFunctionResponse } from '../Util/Types/Interface/UtilInterface';
import mongoose from 'mongoose';
import BloodService from '../service/bloodService';

interface IUserController {
    blood_request(req: CustomRequest, res: Response)
}

class UserController implements IUserController {


    private readonly bloodService: BloodService;

    constructor() {
        this.bloodService = new BloodService();
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

}

export default UserController