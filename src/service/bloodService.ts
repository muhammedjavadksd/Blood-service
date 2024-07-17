import mongoose from "mongoose";
import { BloodGroup, BloodStatus, LocatedAt, Relationship, StatusCode } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import IBloodRequirement from "../Util/Types/Interface/ModelInterface";

interface IBloodService {
    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse>
}

class BloodService implements IBloodService {

    private readonly bloodRepo: BloodRepo;
    private readonly utilHelper: UtilHelper;

    constructor() {
        this.bloodRepo = new BloodRepo();
        this.utilHelper = new UtilHelper();
    }

    async createBloodId(blood_group: BloodGroup, unit: number): Promise<string> {
        let blood_id: string = blood_group + unit + this.utilHelper.createRandomText(5);
        let isUserExist: IBloodRequirement | null = await this.bloodRepo.findBloodRequirementByBloodId(blood_id);
        while (isUserExist) {
            blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
        }
        return blood_id
    }


    async createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse> {
        const blood_id: string = await this.createBloodId(blood_group, unit)
        const createdBloodRequest: mongoObjectId | null = await this.bloodRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber)
        if (createdBloodRequest) {
            return {
                msg: "Blood requirement created success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    blood_id: blood_id,
                    id: createdBloodRequest
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR,
            }
        }
    }

}


export default BloodService