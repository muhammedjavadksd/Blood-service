import { ObjectId } from "mongoose";
import { IBloodDonorTemplate } from "../Util/Types/Interface/ModelInterface";
import BloodDonorCollection from "../db/model/donors";

interface IBloodDonorRepo {
    createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId>
}

class BloodDonorRepo implements IBloodDonorRepo {

    private readonly BloodDonor: typeof BloodDonorCollection

    constructor() {
        this.BloodDonor = BloodDonorCollection;
    }

    async createDonor(donorData: IBloodDonorTemplate): Promise<null | ObjectId> {
        const insertDonor = new this.BloodDonor(donorData);
        const save = await insertDonor.save();
        return save.id
    }

}

export default BloodDonorRepo