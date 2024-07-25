import { NextFunction, Request, Response } from "express";
import BloodService from "../service/bloodService";
import { BloodGroupUpdateStatus } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";


interface IAdminController {

    bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void>
}

class AdminController implements IAdminController {

    private readonly bloodService

    constructor() {
        this.bloodService = new BloodService()
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

}

export default AdminController