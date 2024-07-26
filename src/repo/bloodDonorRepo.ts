import { ObjectId } from "mongoose";
import { IBloodDonor, IBloodDonorTemplate, ISearchBloodDonorTemplate, IUserBloodDonorEditable } from "../Util/Types/Interface/ModelInterface";
import BloodDonorCollection from "../db/model/donors";
import { BloodDonorStatus } from "../Util/Types/Enum";

interface IBloodDonorRepo {
    createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId>
    findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null>
    updateBloodDonor(editData: IUserBloodDonorEditable, edit_id: string): Promise<boolean>
    findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]>
    blockDonor(donor_id: string): Promise<boolean>
    unBlockDonor(donor_id: string): Promise<boolean>
}

class BloodDonorRepo implements IBloodDonorRepo {

    private readonly BloodDonor: typeof BloodDonorCollection

    constructor() {
        this.BloodDonor = BloodDonorCollection;
    }

    async blockDonor(donor_id: string): Promise<boolean> {
        const blockedDate = new Date()
        const updateData = await this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: BloodDonorStatus.Blocked, blocked_date: blockedDate } })
        return updateData.modifiedCount > 0
    }

    async unBlockDonor(donor_id: string): Promise<boolean> {
        const updateData = await this.BloodDonor.updateOne({ donor_id: donor_id }, { $set: { status: BloodDonorStatus.Open } })
        return updateData.modifiedCount > 0
    }

    async findDonors(filter: ISearchBloodDonorTemplate): Promise<IBloodDonor[]> {
        const findDonors = await this.BloodDonor.find(filter);
        return findDonors;
    }

    async updateBloodDonor(editData: IUserBloodDonorEditable, edit_id: string): Promise<boolean> {
        const updateData = await this.BloodDonor.updateOne({ donor_id: edit_id }, { $set: editData })
        return updateData.modifiedCount > 0
    }

    async findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null> {
        const findDonor: IBloodDonor | null = await this.BloodDonor.findOne({ donor_id });
        return findDonor
    }

    async createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId> {
        const insertDonor = new this.BloodDonor(donorData);
        const save = await insertDonor.save();
        return save?.id
    }

}

export default BloodDonorRepo