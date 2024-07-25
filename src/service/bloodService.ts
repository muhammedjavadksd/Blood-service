import mongoose, { ObjectId } from "mongoose";
import { BloodGroup, BloodStatus, LocatedAt, Relationship, StatusCode } from "../Util/Types/Enum";
import { HelperFunctionResponse } from "../Util/Types/Interface/UtilInterface";
import { mongoObjectId } from "../Util/Types/Types";
import BloodRepo from "../repo/bloodReqRepo";
import UtilHelper from "../Util/Helpers/UtilHelpers";
import IBloodRequirement, { IBloodDonor, IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import BloodDonorRepo from "../repo/bloodDonorRepo";

interface IBloodService {
    createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse>
    createBloodId(blood_group: BloodGroup, unit: number): Promise<string>
    bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: string): Promise<HelperFunctionResponse>
    createDonorId(blood_group: BloodGroup, fullName: string): Promise<string>
    closeRequest(blood_group: BloodGroup): Promise<HelperFunctionResponse>
}

class BloodService implements IBloodService {

    private readonly bloodReqRepo: BloodRepo;
    private readonly bloodDonorRepo: BloodDonorRepo;
    private readonly utilHelper: UtilHelper;

    constructor() {
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.createBloodId = this.createBloodId.bind(this)
        this.bloodDonation = this.bloodDonation.bind(this)
        this.createDonorId = this.createDonorId.bind(this)
        this.closeRequest = this.closeRequest.bind(this)
        this.createBloodRequirement = this.createBloodRequirement.bind(this)
        this.bloodReqRepo = new BloodRepo();
        this.bloodDonorRepo = new BloodDonorRepo();
        this.utilHelper = new UtilHelper();
    }

    async createDonorId(blood_group: BloodGroup, fullName: string): Promise<string> {
        let blood_id: string = fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5) + blood_group;
        let isDonorExist: IBloodDonor | null = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        while (isDonorExist) {
            blood_id = blood_group + fullName.slice(0, 2).toUpperCase() + this.utilHelper.createRandomText(5);
            isDonorExist = await this.bloodDonorRepo.findBloodDonorByDonorId(blood_id);
        }
        return blood_id
    }


    async createBloodId(blood_group: BloodGroup, unit: number): Promise<string> {
        let blood_id: string = blood_group + unit + this.utilHelper.createRandomText(5);
        let isUserExist: IBloodRequirement | null = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        while (isUserExist) {
            blood_id = blood_group + unit + this.utilHelper.createRandomText(5);
            isUserExist = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        }
        return blood_id
    }


    async createBloodRequirement(patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<HelperFunctionResponse> {
        const blood_id: string = await this.createBloodId(blood_group, unit)
        const createdBloodRequest: mongoObjectId | null = await this.bloodReqRepo.createBloodRequirement(blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber)
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

    async bloodDonation(fullName: string, emailID: string, phoneNumber: number, bloodGroup: BloodGroup, location: string): Promise<HelperFunctionResponse> {

        const BloodDonorId: string = await this.createDonorId(bloodGroup, fullName);
        const saveData: IBloodDonorTemplate = {
            blood_group: bloodGroup,
            donor_id: BloodDonorId,
            email_address: emailID,
            full_name: fullName,
            locatedAt: location,
            phoneNumber: phoneNumber,
        };
        const saveDonorIntoDb: ObjectId | null = await this.bloodDonorRepo.createDonor(saveData);
        if (saveDonorIntoDb) {
            return {
                msg: "User inserted success",
                status: true,
                statusCode: StatusCode.CREATED,
                data: {
                    donor_db_id: saveDonorIntoDb,
                    donor_id: BloodDonorId
                }
            }
        } else {
            return {
                msg: "User inserted failed",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }


    async closeRequest(blood_id: string): Promise<HelperFunctionResponse> {
        const bloodRequestion = await this.bloodReqRepo.findBloodRequirementByBloodId(blood_id);
        if (bloodRequestion) {
            const updateData: boolean = await this.bloodReqRepo.updateBloodDonor(blood_id, {
                is_closed: true
            });
            if (updateData) {
                return {
                    msg: "Requirement closed",
                    status: true,
                    statusCode: StatusCode.OK
                }
            } else {
                return {
                    msg: "Requirement closing failed",
                    status: false,
                    statusCode: StatusCode.BAD_REQUEST
                }
            }
        } else {
            return {
                msg: "Internal server error",
                status: false,
                statusCode: StatusCode.SERVER_ERROR
            }
        }
    }

}


export default BloodService