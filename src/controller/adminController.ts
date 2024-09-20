import { NextFunction, Request, Response } from "express";
import BloodService from "../service/bloodService";
import { BloodCloseCategory, BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupUpdateStatus, BloodStatus, ExtendsRelationship, Relationship, StatusCode } from "../Util/Types/Enum";
import { CustomRequest, HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { ObjectId } from "mongoose";
import { LocatedAt } from "../Util/Types/Types";


interface IAdminController {
    bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    getAllRequirements(req: Request, res: Response): Promise<void>
    updateBloodRequirements(req: Request, res: Response): Promise<void>
    addBloodRequirement(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    viewSingleRequirement(req: Request, res: Response): Promise<void>
    findDonorByBloodGroup(req: Request, res: Response): Promise<void>
    // updateRequirementStatus(req: Request, res: Response): Promise<void>
}

class AdminController implements IAdminController {

    private readonly bloodService

    constructor() {
        this.bloodService = new BloodService()
    }



    async findDonorByBloodGroup(req: Request, res: Response): Promise<void> {

        const limit: number = +req.params.limit
        const page: number = +req.params.page
        const bloodGroup: BloodGroup = req.params.blood_group as BloodGroup;

        const findData = await this.bloodService.searchBloodDonors(page, limit, bloodGroup, BloodDonorStatus.Open);
        res.status(findData.statusCode).json({ status: findData.status, msg: findData.msg, data: findData.data });
    }


    async viewSingleRequirement(req: Request, res: Response): Promise<void> {

        const req_id: string = req.params.blood_id;
        if (req_id) {
            const findRequirement = await this.bloodService.findSingleBloodRequirement(req_id)
            res.status(findRequirement.statusCode).json({ status: findRequirement.status, msg: findRequirement.msg, data: findRequirement.data })
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide valid data" });
        }
    }


    async closeRequest(req: Request, res: Response): Promise<void> {
        const blood_id: string = req.params.blood_id;
        if (blood_id) {
            const closeRequest = await this.bloodService.closeRequest(blood_id, BloodCloseCategory.AdminClose, "Admin closed the requirement");
            res.status(closeRequest.statusCode).json({ status: closeRequest.status, msg: closeRequest.msg, data: closeRequest.data });
        } else {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please provide valid data" });
        }
    }


    async addBloodRequirement(req: CustomRequest, res: Response): Promise<void> {

        const requestData = req.body.requestData;

        const patientName: string = requestData.patientName;
        const unit: number = requestData.unit;
        const neededAt: Date = requestData.neededAt;
        const status = requestData.status;
        const blood_group: BloodGroup = requestData.blood_group;
        const relationship: ExtendsRelationship = "Admin";
        const locatedAt: LocatedAt = req.body.locatedAt;
        const address: string = req.body.address;
        const phoneNumber: number = req.body.phoneNumber;
        const email_address: string = req.body.email_address;
        const user_id = req.context?.user_id;

        const addRequirement = await this.bloodService.createBloodRequirement(patientName, unit, neededAt, status, user_id, user_id, blood_group, relationship, locatedAt, address, phoneNumber, email_address,)
        res.status(addRequirement.statusCode).json({ status: addRequirement.status, msg: addRequirement.msg, data: addRequirement.data })
    }

    async updateBloodRequirements(req: Request, res: Response): Promise<void> {
        const blood_id: string = req.params.requirement_id;
        const status: BloodStatus = req.params.new_status as BloodStatus;
        const update = await this.bloodService.updateProfileStatus(blood_id, status);
        res.status(update.statusCode).json({ status: update.status, msg: update.msg, data: update.data });
    }

    async getAllRequirements(req: Request, res: Response): Promise<void> {

        const page: number = +req.params.page
        const limit: number = +req.params.limit
        const status: BloodStatus = req.params.status as BloodStatus

        const findProfile = await this.bloodService.findPaginatedBloodRequirements(page, limit, status);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }



    async bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        const limit: number = parseInt(req.params.limit);
        const page: number = parseInt(req.params.page)
        const status: BloodGroupUpdateStatus = req.params.status as BloodGroupUpdateStatus;

        const findRequets: HelperFunctionResponse = await this.bloodService.findBloodGroupChangeRequets(status, page, limit)
        res.status(findRequets.statusCode).json({ status: findRequets.status, msg: findRequets.msg, data: findRequets.data })
    }

    async updateBloodGroup(req: Request, res: Response): Promise<void> {

        const request_id: ObjectId = req.params.request_id as unknown as ObjectId;
        const status: BloodGroupUpdateStatus = req.params.new_status as BloodGroupUpdateStatus
        const updateBloodGroup: HelperFunctionResponse = await this.bloodService.updateBloodGroup(request_id, status);
        res.status(updateBloodGroup.statusCode).json({ status: updateBloodGroup.status, msg: updateBloodGroup.msg })
    }

}

export default AdminController