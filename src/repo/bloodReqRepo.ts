import BloodRequirement from "../db/model/requirements";
import { BloodGroup, BloodStatus, Relationship } from "../Util/Types/Enum";
import IBloodRequirement, { IEditableBloodRequirementTemplate } from "../Util/Types/Interface/ModelInterface";
import { LocatedAt, mongoObjectId } from "../Util/Types/Types";


interface IBloodReqDepo {
    createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<mongoObjectId | null>
    findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null>
    updateBloodDonor(blood_id: string, data: IEditableBloodRequirementTemplate): Promise<boolean>
    findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]>
}

class BloodReqDepo implements IBloodReqDepo {


    private readonly BloodReq: typeof BloodRequirement

    constructor() {
        this.BloodReq = BloodRequirement
    }

    async findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]> {
        const bloodGroup: IBloodRequirement[] = await this.BloodReq.find({ blood_group, status: BloodStatus.Pending })
        return bloodGroup
    }



    async findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null> {
        const find: IBloodRequirement | null = await this.BloodReq.findOne({ blood_id });
        return find
    }

    async createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<mongoObjectId | null> {
        try {
            const bloodRequirement = new this.BloodReq({ blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber });
            const userCreated = await bloodRequirement.save();
            return userCreated.id
        } catch (e) {
            return null
        }
    }

    async updateBloodDonor(blood_id: string, data: IEditableBloodRequirementTemplate): Promise<boolean> {
        const updateData = await this.BloodReq.updateOne({ blood_id: blood_id }, { $set: data })
        if (updateData.matchedCount > 0) {
            return true
        } else {
            return false
        }
    }
}

export default BloodReqDepo