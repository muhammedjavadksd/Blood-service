import { ObjectId } from "mongoose";
import { IBloodDonor, IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import BloodDonorCollection from "../db/model/donors";

interface IBloodDonorRepo {
    createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId>
    findBloodDonorByDonorId(donor_id: string): Promise<IBloodDonor | null>
}

class BloodDonorRepo implements IBloodDonorRepo {

    private readonly BloodDonor: typeof BloodDonorCollection

    constructor() {
        this.BloodDonor = BloodDonorCollection;
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