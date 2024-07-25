import { ObjectId } from "mongoose";
import { IBloodGroupUpdateTemplate } from "../Util/Types/Interface/ModelInterface";
import BloodDonorUpdate from "../db/model/updateBloodGroup";
import BloodGroupUpdate from "../db/model/updateBloodGroup";
import { BloodGroupUpdateStatus } from "../Util/Types/Enum";


interface IBloodGroupUpdateRepo {

    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null>
}

class BloodGroupUpdateRepo implements IBloodGroupUpdateRepo {

    private readonly bloodGroupUpdate: typeof BloodGroupUpdate

    constructor() {
        this.bloodGroupUpdate = BloodGroupUpdate;
    }

    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null> {
        const saveData = new this.bloodGroupUpdate(data);
        return saveData?.id
    }

    async findAllRequest(status: BloodGroupUpdateStatus, page: number, limit: number, perPage: number) {
        const findRequest = await this.bloodGroupUpdate.find({ status }).skip(perPage * (page - 1)).limit(limit)
        return findRequest
    }

}

export default BloodGroupUpdateRepo