import BloodRequirement from "../db/model/requirements";
import { BloodGroup, BloodStatus, LocatedAt, Relationship } from "../Util/Types/Enum";
import IBloodRequirement from "../Util/Types/Interface/ModelInterface";
import { mongoObjectId } from "../Util/Types/Types";


interface IBloodRepo {
    createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number): Promise<mongoObjectId | null>
    findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null>
}

class BloodRepo implements IBloodRepo {


    private readonly BloodReq: typeof BloodRequirement

    constructor() {
        this.BloodReq = BloodRequirement
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
}

export default BloodRepo