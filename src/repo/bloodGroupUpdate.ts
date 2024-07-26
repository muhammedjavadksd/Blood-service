import { ObjectId } from "mongoose";
import { IBloodDonorUpdate, IBloodGroupUpdateTemplate, IEditableGroupGroupRequest } from "../Util/Types/Interface/ModelInterface";
import BloodDonorUpdate from "../db/model/updateBloodGroup";
import BloodGroupUpdate from "../db/model/updateBloodGroup";
import { BloodGroupUpdateStatus } from "../Util/Types/Enum";


interface IBloodGroupUpdateRepo {
    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null>
    findRequestById(id: ObjectId): Promise<IBloodDonorUpdate | null>
    updateRequest(update_id: ObjectId, data: IEditableGroupGroupRequest): Promise<boolean>
    findAllRequest(status: BloodGroupUpdateStatus, page: number, limit: number, perPage: number): Promise<IBloodDonorUpdate[]>
}

class BloodGroupUpdateRepo implements IBloodGroupUpdateRepo {

    private readonly bloodGroupUpdate: typeof BloodGroupUpdate

    constructor() {
        this.bloodGroupUpdate = BloodGroupUpdate;
    }

    async updateRequest(update_id: ObjectId, data: IEditableGroupGroupRequest): Promise<boolean> {
        const update = await this.bloodGroupUpdate.updateOne({ id: update_id }, { $set: data });
        return update.modifiedCount > 0
    }

    async findRequestById(id: ObjectId): Promise<IBloodDonorUpdate | null> {
        const findRequest: IBloodDonorUpdate | null = await this.bloodGroupUpdate.findById(id);
        return findRequest
    }

    saveRequest(data: IBloodGroupUpdateTemplate): Promise<ObjectId | null> {
        const saveData = new this.bloodGroupUpdate(data);
        return saveData?.id
    }

    async findAllRequest(status: BloodGroupUpdateStatus, page: number, limit: number, perPage: number): Promise<IBloodDonorUpdate[]> {
        const findRequest = await this.bloodGroupUpdate.find({ status }).skip(perPage * (page - 1)).limit(limit)
        return findRequest
    }

}

export default BloodGroupUpdateRepo