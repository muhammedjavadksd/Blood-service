import { NextFunction, Request, Response } from "express";
import BloodService from "../service/bloodService";
import { BloodGroupUpdateStatus, BloodStatus } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { ObjectId } from "mongoose";


interface IAdminController {
    bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    getAllRequirements(req: Request, res: Response): Promise<void>
    updateBloodRequirements(req: Request, res: Response): Promise<void>
}

class AdminController implements IAdminController {

    private readonly bloodService

    constructor() {
        this.bloodService = new BloodService()
    }

    async updateBloodRequirements(req: Request, res: Response): Promise<void> {
        const blood_id: string = req.params.blood_id;
        const status: BloodStatus = req.params.status as BloodStatus;
        const update = await this.bloodService.updateProfileStatus(blood_id, status);
        res.status(update.statusCode).json({ status: update.status, msg: update.msg, data: update.data });
    }

    async getAllRequirements(req: Request, res: Response): Promise<void> {

        const page: number = +req.params.page
        const limit: number = +req.params.limit

        const findProfile = await this.bloodService.findPaginatedBloodRequirements(page, limit);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }

    // limit/:skip/:per_page

    async bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        const limit: number = parseInt(req.params.limit);
        const skip: number = parseInt(req.params.skip)
        const per_page: number = parseInt(req.params.per_page)
        const status: BloodGroupUpdateStatus = req.params.status as BloodGroupUpdateStatus;

        const findRequets: HelperFunctionResponse = await this.bloodService.findBloodGroupChangeRequets(status, skip, limit, per_page)
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