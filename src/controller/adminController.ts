import { NextFunction, Request, Response } from "express";
import BloodService from "../service/bloodService";
import { BloodCloseCategory, BloodDonationStatus, BloodDonorStatus, BloodGroup, BloodGroupUpdateStatus, BloodStatus, DonorAccountBlockedReason, ExtendsRelationship, Relationship, StatusCode } from "../Util/Types/Enum";
import { CustomRequest, HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { ObjectId } from "mongoose";
import { LocatedAt } from "../Util/Types/Types";
import { ILocatedAt } from "../Util/Types/Interface/ModelInterface";


interface IAdminController {
    getStatitics(req: Request, res: Response, next: NextFunction): Promise<void>
    bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void>
    updateBloodGroup(req: Request, res: Response): Promise<void>
    getAllRequirements(req: Request, res: Response): Promise<void>
    updateBloodRequirements(req: Request, res: Response): Promise<void>
    addBloodRequirement(req: Request, res: Response): Promise<void>
    addDonor(req: Request, res: Response): Promise<void>
    closeRequest(req: Request, res: Response): Promise<void>
    viewSingleRequirement(req: Request, res: Response): Promise<void>
    findDonorByBloodGroup(req: Request, res: Response): Promise<void>
    bloodBank(req: Request, res: Response): Promise<void>
    findNearest(req: Request, res: Response): Promise<void>
    findIntrest(req: Request, res: Response): Promise<void>
    updateDonorStatus(req: Request, res: Response): Promise<void>
    // updateRequirementStatus(req: Request, res: Response): Promise<void>
}

class AdminController implements IAdminController {

    private readonly bloodService

    constructor() {
        this.getStatitics = this.getStatitics.bind(this)
        this.viewSingleRequirement = this.viewSingleRequirement.bind(this)
        this.findIntrest = this.findIntrest.bind(this)
        this.getAllRequirements = this.getAllRequirements.bind(this)
        this.findDonorByBloodGroup = this.findDonorByBloodGroup.bind(this)
        this.closeRequest = this.closeRequest.bind(this)
        this.addBloodRequirement = this.addBloodRequirement.bind(this)
        this.bloodGroupChangeRequests = this.bloodGroupChangeRequests.bind(this)
        this.updateBloodGroup = this.updateBloodGroup.bind(this)
        this.addDonor = this.addDonor.bind(this)
        this.updateDonorStatus = this.updateDonorStatus.bind(this)
        this.findNearest = this.findNearest.bind(this)
        this.updateBloodRequirements = this.updateBloodRequirements.bind(this)
        this.bloodService = new BloodService()
    }

    async updateDonorStatus(req: Request, res: Response): Promise<void> {

        const donorId: string = req.params.donor_id;
        const status: BloodDonorStatus = req.body.status;
        const reason: string = status == BloodDonorStatus.Blocked ? req.body.reason : null;

        const updateDonor = await this.bloodService.updateBloodDonors({ status, blocked_reason: reason }, donorId, true);
        res.status(updateDonor.statusCode).json({ status: updateDonor.status, msg: updateDonor.msg, data: updateDonor.data })
    }


    async addDonor(req: Request, res: Response): Promise<void> {


        const full_name: string = req.body.full_name;
        const blood_group: BloodGroup = req.body.blood_group
        const location: LocatedAt = req.body.location
        const phoneNumber: number = req.body.phone_number
        const email_address: string = req.body.email_address
        const status: BloodDonorStatus = req.body.status
        const isBlocked = status == BloodDonorStatus.Blocked

        console.log("The cord");
        console.log(req.body);


        console.log(location);

        const coords: ILocatedAt = {
            coordinates: location.coordinates,
            type: "Point"
        }


        const addDonor = await this.bloodService.bloodDonation(full_name, email_address, phoneNumber, blood_group, coords, location, status, DonorAccountBlockedReason.AccountJustCreated);
        res.status(addDonor.statusCode).json({ status: addDonor.status, msg: addDonor.msg, data: addDonor.data })
    }


    async findIntrest(req: Request, res: Response): Promise<void> {
        const page: number = +req.params.page
        const limit: number = +req.params.limit
        const blood_id: string = req.params.blood_id

        const findBloodResponse = await this.bloodService.findResponse(blood_id, page, limit);
        res.status(findBloodResponse.statusCode).json({ status: findBloodResponse.status, msg: findBloodResponse.msg, data: findBloodResponse.data })
    }


    async getStatitics(req: Request, res: Response, next: NextFunction): Promise<void> {

        const find = await this.bloodService.getStatitics();
        res.status(find.statusCode).json({ status: find.status, msg: find.msg, data: find.data });
    }


    async findNearest(req: Request, res: Response): Promise<void> {
        const lati = +(req.query.lati || 0)
        const long = +(req.query.long || 0);
        const page: number = +(req.params.page);
        const limit: number = +req.params.limit;
        const blood_group: BloodGroup | null = req.params.blood_group as BloodGroup;

        if (lati == null || lati == undefined || long == null || long == undefined) {
            res.status(StatusCode.BAD_REQUEST).json({ status: false, msg: "Please select valid location" })
        } else {
            const findNearest = await this.bloodService.findNearestBloodDonors(page, limit, [long, lati], true, blood_group);
            res.status(findNearest.statusCode).json({ status: findNearest.status, msg: findNearest.msg, data: findNearest.data })
        }
    }


    async bloodBank(req: Request, res: Response): Promise<void> {

        const page: number = +req.params.page;
        const limit: number = +req.params.limit;
        const bloodGroup: BloodGroup = req.params.bloodGroup as BloodGroup;
        const isUrgent: boolean = req.query.is_urgent == "true";
        const hospital_id: string | undefined = req.query.hospital_id?.toString();

        const bloodBank = await this.bloodService.advanceBloodBankSearch(page, limit, false, bloodGroup, isUrgent, hospital_id);
        res.status(bloodBank.statusCode).json({ status: bloodBank.status, msg: bloodBank.msg, data: bloodBank.data });
    }




    async findDonorByBloodGroup(req: Request, res: Response): Promise<void> {

        console.log("Reached here");


        const limit: number = +req.params.limit
        const page: number = +req.params.page
        const bloodGroup: BloodGroup = req.params.blood_group as BloodGroup;
        const isActiveOnly: string | null = <string>req.query.active || null;
        const status: string | null = isActiveOnly || null

        const findData = await this.bloodService.searchBloodDonors(page, limit, bloodGroup, status);
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

        // const requestData = re;

        const patientName: string = req.body.patientName;
        const unit: number = req.body.unit;
        const neededAt: Date = req.body.neededAt;
        const status = req.body.status;
        const blood_group: BloodGroup = req.body.blood_group;
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
        const bloodGroup: BloodGroup | undefined = req.query.blood_group as BloodGroup
        const lang: string | undefined = req.query.lang?.toString()
        const long: string | undefined = req.query.long?.toString();
        const closedOnly: boolean = req.query.closed == "true"
        const location: [string, string] | null = (lang && long) ? [lang, long] : null

        console.log("Query");
        console.log(req.query);


        const findProfile = await this.bloodService.findPaginatedBloodRequirements(page, limit, status, bloodGroup, location, closedOnly);
        res.status(findProfile.statusCode).json({ status: findProfile.status, msg: findProfile.msg, data: findProfile.data })
    }



    async bloodGroupChangeRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        const limit: number = parseInt(req.params.limit);
        const page: number = parseInt(req.params.page)
        const status: BloodGroupUpdateStatus | null = req.params.status as BloodGroupUpdateStatus;

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