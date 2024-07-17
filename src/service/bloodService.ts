import mongoose from "mongoose";
import { BloodGroup, BloodStatus, LocatedAt, Relationship } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";

interface IBloodService {
    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse>
}

class BloodService implements IBloodService {

    private readonly bloodRepo;
    private readonly utilHelper;

    constructor() {
        this.bloodRepo = new BloodRepo();
        this.utilHelper = new UtilHelper();
    }

    createBloodId(blood_group: BloodGroup, unit: number) {
        const blood_id: string = blood_group + unit + this.utilHelper(5);

    }


    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse> {
        const blood_id = 
    }

}