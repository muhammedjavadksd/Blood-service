import BloodRequirement from "../db/model/requirements";
import { BloodGroup, BloodStatus, Relationship } from "../Util/Types/Enum";
import IBloodRequirement, { IEditableBloodRequirementTemplate } from "../Util/Types/Interface/ModelInterface";
import { LocatedAt, mongoObjectId } from "../Util/Types/Types";


interface IBloodReqDepo {
    createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number, is_closed: boolean): Promise<mongoObjectId | null>
    findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null>
    updateBloodDonor(blood_id: string, data: IEditableBloodRequirementTemplate): Promise<boolean>
    findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]>
    findActiveBloodReqPaginted(limit: number, skip: number): Promise<IBloodRequirement[]>
}

class BloodReqDepo implements IBloodReqDepo {


    private readonly BloodReq: typeof BloodRequirement

    constructor() {
        this.BloodReq = BloodRequirement
    }

    async findActiveBloodReqPaginted(limit: number, skip: number): Promise<IBloodRequirement[]> {
        const bloodGroup: IBloodRequirement[] = await this.BloodReq.find({ status: BloodStatus.Pending }).skip(skip).limit(limit)
        return bloodGroup
    }

    async findActiveBloodReq(blood_group: BloodGroup): Promise<IBloodRequirement[]> {
        const bloodGroup: IBloodRequirement[] = await this.BloodReq.find({ blood_group, status: BloodStatus.Pending })
        return bloodGroup
    }



    async findBloodRequirementByBloodId(blood_id: string): Promise<IBloodRequirement | null> {
        const find: IBloodRequirement | null = await this.BloodReq.findOne({ blood_id });
        return find
    }

    async createBloodRequirement(blood_id: string, patientName: string, unit: number, neededAt: Date, status: BloodStatus, user_id: mongoObjectId, profile_id: string, blood_group: BloodGroup, relationship: Relationship, locatedAt: LocatedAt, address: string, phoneNumber: number, is_closed: boolean,): Promise<mongoObjectId | null> {
        console.log('blood_id:', blood_id);
        console.log('patientName:', patientName);
        console.log('unit:', unit);
        console.log('neededAt:', neededAt);
        console.log('status:', status);
        console.log('user_id:', user_id);
        console.log('profile_id:', profile_id);
        console.log('blood_group:', blood_group);
        console.log('relationship:', relationship);
        console.log('locatedAt:', locatedAt);
        console.log('address:', address);
        console.log('phoneNumber:', phoneNumber);
        console.log('is_closed:', is_closed);
        try {
            const bloodRequirement = new this.BloodReq({ blood_id, patientName, unit, neededAt, status, user_id, profile_id, blood_group, relationship, locatedAt, address, phoneNumber, is_closed });
            const userCreated = await bloodRequirement.save();
            return userCreated.id
        } catch (e) {
            console.log(e);

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